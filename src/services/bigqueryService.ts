import { SchemaField } from '@/types';
import { configService } from './configService';
import { authService } from './authService';

interface BigQueryConfig {
  projectId: string;
  datasetId: string;
  tableId: string;
  location?: string;
}

interface FileProcessingResult {
  recordCount: number;
  schema: SchemaField[];
  errors: string[];
}

// Production BigQuery API Service with Real OAuth implementation
export class BigQueryService {
  private baseUrl = 'https://bigquery.googleapis.com/bigquery/v2';

  constructor() {
    console.log('🔧 BigQueryService initialized with OAuth authentication');
  }

  private async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    console.log('🌐 Making authenticated BigQuery request to:', url.replace(this.baseUrl, ''));

    try {
      return await authService.authenticatedFetch(url, options);
    } catch (error) {
      console.error('❌ BigQuery API request failed:', error);
      throw error;
    }
  }

  async createDataset(projectId: string, datasetId: string, location: string = 'US'): Promise<void> {
    console.log('📁 Creating BigQuery dataset:', { projectId, datasetId, location });

    const url = `${this.baseUrl}/projects/${projectId}/datasets`;

    try {
      const response = await this.makeAuthenticatedRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          datasetReference: {
            datasetId: datasetId,
            projectId: projectId
          },
          location: location,
          description: 'Dataset created by GIS Processing Application'
        })
      });

      if (!response.ok) {
        if (response.status === 409) {
          console.log('📁 Dataset already exists, continuing...');
          return;
        }

        const errorData = await response.json();
        const errorMessage = errorData.error?.message || 'Unknown error';

        console.error('❌ Dataset creation failed:', errorMessage);
        throw new Error(`Failed to create dataset: ${errorMessage}`);
      }

      console.log('✅ Dataset created successfully');
    } catch (error) {
      if (error instanceof Error && error.message.includes('authentication')) {
        throw new Error('Authentication failed. Please sign in with Google OAuth.');
      }
      throw error;
    }
  }

  async createTable(config: BigQueryConfig, schema: SchemaField[]): Promise<void> {
    console.log('📊 Creating BigQuery table:', { ...config, schemaFields: schema?.length || 0 });

    // First ensure dataset exists
    try {
      await this.createDataset(config.projectId, config.datasetId);
    } catch (error) {
      console.warn('⚠️ Dataset creation issue:', error);
    }

    const url = `${this.baseUrl}/projects/${config.projectId}/datasets/${config.datasetId}/tables`;

    const tableSchema = {
      fields: schema.map((field) => ({
        name: field.name,
        type: field.type,
        mode: field.mode || 'NULLABLE'
      }))
    };

    try {
      const response = await this.makeAuthenticatedRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          tableReference: {
            projectId: config.projectId,
            datasetId: config.datasetId,
            tableId: config.tableId
          },
          schema: tableSchema,
          description: 'Table created by GIS Processing Application'
        })
      });

      if (!response.ok) {
        if (response.status === 409) {
          console.log('📊 Table already exists, continuing...');
          return;
        }

        const errorData = await response.json();
        const errorMessage = errorData.error?.message || 'Unknown error';

        console.error('❌ Table creation failed:', errorMessage);
        throw new Error(`Failed to create table: ${errorMessage}`);
      }

      console.log('✅ Table created successfully');
    } catch (error) {
      if (error instanceof Error && error.message.includes('authentication')) {
        throw new Error('Authentication failed. Please sign in with Google OAuth.');
      }
      throw error;
    }
  }

  async loadDataFromGCS(config: BigQueryConfig, gcsUri: string, schema?: SchemaField[]): Promise<string> {
    const useSchema = schema && schema.length > 0;
    console.log('📥 Loading data from GCS to BigQuery:', {
      ...config,
      gcsUri,
      schemaFields: schema?.length || 0,
      willUseSchema: useSchema,
      willAutoDetect: !useSchema,
    });
  
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const url = `${this.baseUrl}/projects/${config.projectId}/jobs`;
  
    const jobConfig: any = {
      jobReference: {
        projectId: config.projectId,
        jobId: jobId,
      },
      configuration: {
        load: {
          sourceUris: [gcsUri],
          destinationTable: {
            projectId: config.projectId,
            datasetId: config.datasetId,
            tableId: config.tableId,
          },
          writeDisposition: 'WRITE_TRUNCATE',
          createDisposition: 'CREATE_IF_NEEDED',
          sourceFormat: 'NEWLINE_DELIMITED_JSON',
          // Corrected logic: autodetect is true only if there is no valid, non-empty schema.
          autodetect: !useSchema,
        },
      },
    };
  
    // Only add the schema object to the request if we have a valid one.
    if (useSchema) {
      jobConfig.configuration.load.schema = {
        fields: schema,
      };
    }
  
    console.log('🎯 Final BigQuery job configuration:', JSON.stringify(jobConfig, null, 2));
  
    try {
      const response = await this.makeAuthenticatedRequest(url, {
        method: 'POST',
        body: JSON.stringify(jobConfig),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || 'Unknown error';
  
        console.error('❌ BigQuery load job failed:', errorMessage);
        throw new Error(`Failed to start load job: ${errorMessage}`);
      }
  
      const result = await response.json();
      console.log('✅ BigQuery load job started:', jobId);
      return jobId;
    } catch (error) {
      if (error instanceof Error && error.message.includes('authentication')) {
        throw new Error('Authentication failed. Please sign in with Google OAuth.');
      }
      throw error;
    }
  }

  async getJobStatus(jobId: string): Promise<{
    status: 'PENDING' | 'RUNNING' | 'DONE';
    errors?: Array<{message: string;reason: string;}>;
    statistics?: {
      load?: {
        outputRows: string;
        outputBytes: string;
      };
    };
  }> {
    console.log('🔍 Getting BigQuery job status:', jobId);

    // Extract project ID from service account or use configured project
    const projectId = configService.getConfig().gcpProjectId;
    if (!projectId) {
      throw new Error('Project ID is required for job status queries');
    }

    const url = `${this.baseUrl}/projects/${projectId}/jobs/${jobId}`;

    try {
      const response = await this.makeAuthenticatedRequest(url);

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || 'Unknown error';

        console.error('❌ Job status query failed:', errorMessage);
        throw new Error(`Failed to get job status: ${errorMessage}`);
      }

      const result = await response.json();

      return {
        status: result.status?.state || 'PENDING',
        errors: result.status?.errors,
        statistics: result.statistics
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('authentication')) {
        throw new Error('Authentication failed. Please sign in with Google OAuth.');
      }
      throw error;
    }
  }

  async queryTable(config: BigQueryConfig, limit: number = 1000): Promise<any[]> {
    const query = `SELECT * FROM \`${config.projectId}.${config.datasetId}.${config.tableId}\` LIMIT ${limit}`;
    console.log('🔍 Querying BigQuery table:', query);

    const url = `${this.baseUrl}/projects/${config.projectId}/queries`;

    try {
      const response = await this.makeAuthenticatedRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          query: query,
          useLegacySql: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || 'Unknown error';

        console.error('❌ BigQuery query failed:', errorMessage);
        throw new Error(`Failed to query table: ${errorMessage}`);
      }

      const result = await response.json();
      return result.rows || [];
    } catch (error) {
      if (error instanceof Error && error.message.includes('authentication')) {
        throw new Error('Authentication failed. Please sign in with Google OAuth.');
      }
      throw error;
    }
  }

  async testConnection(projectId?: string): Promise<{
    success: boolean;
    error?: string;
    projectId?: string;
  }> {
    try {
      console.log('🔍 Testing BigQuery connection...');

      // Check if authenticated
      if (!authService.isAuthenticated()) {
        return {
          success: false,
          error: 'Not authenticated. Please sign in with Google OAuth.'
        };
      }

      // Validate token
      const validation = await authService.validateToken();
      if (!validation.valid) {
        return {
          success: false,
          error: `Token validation failed: ${validation.error}`
        };
      }

      // Check required scopes
      const hasScopes = await authService.hasRequiredScopes();
      if (!hasScopes) {
        const missingScopes = await authService.getMissingScopes();
        return {
          success: false,
          error: `Missing required scopes: ${missingScopes.join(', ')}`
        };
      }

      // Test API access by listing datasets
      const testProjectId = projectId || configService.getConfig().gcpProjectId || 'demo-project';
      const testUrl = `${this.baseUrl}/projects/${testProjectId}/datasets`;

      const response = await this.makeAuthenticatedRequest(testUrl);

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || 'Unknown error';
        return {
          success: false,
          error: `BigQuery API test failed: ${errorMessage}`
        };
      }

      console.log('✅ BigQuery connection test passed');
      return {
        success: true,
        projectId: testProjectId
      };

    } catch (error) {
      console.error('❌ BigQuery connection test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown connection error';
      return {
        success: false,
        error: `Failed to connect to BigQuery API: ${errorMessage}`
      };
    }
  }

  // Method to clear cached tokens (useful for logout)
  clearAuthCache(): void {
    authService.clearToken();
    console.log('🧹 BigQuery authentication cache cleared');
  }

  // Method to check if user is authenticated
  isAuthenticated(): boolean {
    return authService.isAuthenticated();
  }

  // Get authentication status
  getAuthStatus(): {
    isAuthenticated: boolean;
    willExpireSoon: boolean;
    timeUntilExpiry: number | null;
  } {
    return {
      isAuthenticated: authService.isAuthenticated(),
      willExpireSoon: authService.willExpireSoon(),
      timeUntilExpiry: authService.getTimeUntilExpiry()
    };
  }
}

export const bigqueryService = new BigQueryService();