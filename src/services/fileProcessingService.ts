import { SchemaField } from '@/types';

export class FileProcessingService {
  async processFile(file: File): Promise<{ convertedFile: File, schema: SchemaField[] }> {
    console.log('🔄 Processing file:', file.name);

    const formData = new FormData();
    formData.append('shapefile', file);

    try {
      const response = await fetch('/api/convert-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`File conversion failed: ${errorText}`);
      }

      const schemaHeader = response.headers.get('X-Generated-Schema');
      let schema: SchemaField[] = [];
      
      if (schemaHeader) {
        try {
          schema = JSON.parse(schemaHeader);
          console.log('✅ Received schema from backend:', schema);
        } catch (e) {
          console.warn('Could not parse schema from header:', e);
          schema = [];
        }
      }

      const blob = await response.blob();
      const convertedFile = new File([blob], `${file.name}.geojson`, { 
        type: 'application/geo+json' 
      });
      
      console.log('✅ File processing successful');
      return { convertedFile, schema };

    } catch (error) {
      console.error('❌ File processing failed:', error);
      throw error;
    }
  }

  async processGcsFile(
    gcsBucket: string,
    gcsPath: string
  ): Promise<{ processedFileUrl: string; processedFileName: string }> {
    console.log(`🔄 Processing GCS file: gs://${gcsBucket}/${gcsPath}`);
    
    const response = await fetch('/api/convert-gcs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bucket: gcsBucket, path: gcsPath }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'GCS file conversion failed');
    }

    const result = await response.json();
    return {
      processedFileUrl: result.gcsUri,
      processedFileName: result.gcsUri.split('/').pop() || 'processed-file'
    };
  }

  async testApiConnection(): Promise<{
    success: boolean;
    endpoint: string;
    hasApiKey: boolean;
    error?: string;
  }> {
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
      });

      return {
        success: response.ok,
        endpoint: '/api',
        hasApiKey: true,
        error: response.ok ? undefined : `HTTP ${response.status}`
      };
    } catch (error) {
      return {
        success: false,
        endpoint: '/api',
        hasApiKey: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }

  async validateProcessedFile(gcsUri: string): Promise<boolean> {
    return !!gcsUri;
  }
}

export const fileProcessingService = new FileProcessingService();