// Configuration Service for Production Settings
interface AppConfig {
  apiEndpoint: string;
  apiKey: string;
  environment: 'development' | 'staging' | 'production';
  gcpProjectId?: string;
  gcsDefaultBucket?: string;
  bigQueryDefaultDataset?: string;
  enableRealProcessing: boolean;
  maxFileSize: number; // in MB
  supportedFormats: string[];
  authMethod?: 'api-gateway' | 'oauth';
}

interface OAuthConfig {
  googleClientId?: string;
  googleClientSecret?: string;
}

export const DEFAULT_GOOGLE_CLIENT_ID = 'your-google-client-id.apps.googleusercontent.com';

class ConfigService {
  private config: AppConfig;
  private readonly STORAGE_KEY = 'gis_app_config';

  constructor() {
    // Try to load from localStorage first
    const savedConfig = this.loadFromStorage();

    this.config = {
      apiEndpoint: import.meta.env.VITE_API_ENDPOINT || 'https://your-api-gateway.com/api',
      apiKey: import.meta.env.VITE_API_KEY || '',
      environment: import.meta.env.VITE_ENVIRONMENT as any || 'development',
      gcpProjectId: import.meta.env.VITE_GCP_PROJECT_ID,
      gcsDefaultBucket: import.meta.env.VITE_GCS_DEFAULT_BUCKET,
      bigQueryDefaultDataset: import.meta.env.VITE_BIGQUERY_DEFAULT_DATASET,
      enableRealProcessing: import.meta.env.VITE_ENABLE_REAL_PROCESSING === 'true',
      maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '500', 10),
      supportedFormats: ['zip', 'shp', 'geojson', 'kml'],
      authMethod: import.meta.env.VITE_AUTH_METHOD as any || 'oauth', // Default to OAuth
      // Override with saved configuration
      ...savedConfig
    };

    console.log('🔧 ConfigService initialized:', {
      environment: this.config.environment,
      authMethod: this.config.authMethod,
      enableRealProcessing: this.config.enableRealProcessing,
      hasApiKey: !!this.config.apiKey,
      defaultBucket: this.config.gcsDefaultBucket,
      isProductionReady: this.isProductionReady(),
      isRealProcessingEnabled: this.isRealProcessingEnabled(),
      oauthConfigured: this.isOAuthConfigured()
    });
  }

  private loadFromStorage(): Partial<AppConfig> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        console.log('Loading configuration from localStorage');
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load configuration from localStorage:', error);
    }
    return {};
  }

  private saveToStorage(): void {
    try {
      // Only save user-configurable settings, not environment variables
      const configToSave = {
        authMethod: this.config.authMethod,
        enableRealProcessing: this.config.enableRealProcessing,
        gcpProjectId: this.config.gcpProjectId,
        gcsDefaultBucket: this.config.gcsDefaultBucket,
        bigQueryDefaultDataset: this.config.bigQueryDefaultDataset,
        maxFileSize: this.config.maxFileSize,
        apiEndpoint: this.config.apiEndpoint,
        apiKey: this.config.apiKey
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(configToSave));
      console.log('Configuration saved to localStorage');
    } catch (error) {
      console.warn('Failed to save configuration to localStorage:', error);
    }
  }

  getConfig(): AppConfig {
    return { ...this.config };
  }

  isProduction(): boolean {
    return this.config.environment === 'production';
  }

  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  getApiEndpoint(): string {
    return this.config.apiEndpoint;
  }

  getApiKey(): string {
    return this.config.apiKey;
  }

  getAuthMethod(): 'api-gateway' | 'oauth' {
    return this.config.authMethod || 'oauth';
  }

  // Check if OAuth is properly configured
  private isOAuthConfigured(): boolean {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    return clientId &&
    clientId !== DEFAULT_GOOGLE_CLIENT_ID &&
    !clientId.includes('your-google-client-id') &&
    clientId.endsWith('.apps.googleusercontent.com');
  }

  isRealProcessingEnabled(): boolean {
    // Real processing is enabled if:
    // 1. The flag is explicitly enabled AND
    // 2. We have valid authentication configured
    return this.config.enableRealProcessing && this.hasValidAuthentication();
  }

  isProductionReady(): boolean {
    // Check if production configuration is complete
    return this.hasValidAuthentication();
  }

  private hasValidAuthentication(): boolean {
    if (this.config.authMethod === 'api-gateway') {
      return !!(this.config.apiEndpoint && this.config.apiKey);
    } else if (this.config.authMethod === 'oauth') {
      // OAuth is valid if properly configured
      return this.isOAuthConfigured();
    }
    return false;
  }

  getMaxFileSize(): number {
    return this.config.maxFileSize;
  }

  getSupportedFormats(): string[] {
    return [...this.config.supportedFormats];
  }

  updateConfig(updates: Partial<AppConfig>): void {
    console.log('🔧 Updating configuration:', updates);

    this.config = { ...this.config, ...updates };
    this.saveToStorage();

    // Log the updated state
    console.log('🔧 Configuration updated:', {
      environment: this.config.environment,
      authMethod: this.config.authMethod,
      enableRealProcessing: this.config.enableRealProcessing,
      hasApiKey: !!this.config.apiKey,
      defaultBucket: this.config.gcsDefaultBucket,
      isProductionReady: this.isProductionReady(),
      isRealProcessingEnabled: this.isRealProcessingEnabled(),
      oauthConfigured: this.isOAuthConfigured()
    });
  }

  validateRequiredConfig(): string[] {
    const errors: string[] = [];

    if (this.config.authMethod === 'api-gateway') {
      if (!this.config.apiEndpoint) {
        errors.push('API endpoint is required for API Gateway authentication');
      }
      if (this.config.enableRealProcessing && !this.config.apiKey) {
        errors.push('API key is required for real processing with API Gateway');
      }
    } else if (this.config.authMethod === 'oauth') {
      // OAuth validation
      if (!this.isOAuthConfigured()) {
        errors.push('Google OAuth client ID is not properly configured');
        errors.push('Please set VITE_GOOGLE_CLIENT_ID in your .env file with a valid Google Client ID');
      }
    }
    return errors;
  }

  async getOAuthConfig(): Promise<OAuthConfig> {
    return {
      googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      googleClientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET
    };
  }

  getEnvironmentInfo(): {
    environment: string;
    realProcessingEnabled: boolean;
    apiConfigured: boolean;
    configErrors: string[];
    productionReady: boolean;
    defaultBucket?: string;
    projectId?: string;
    implementationWarnings: string[];
    oauthConfigured: boolean;
    oauthClientId?: string;
  } {
    const authConfigured = this.config.authMethod === 'api-gateway' ? 
      !!(this.config.apiEndpoint && this.config.apiKey) :
      this.isOAuthConfigured(); // OAuth configured check

    const productionReady = this.isProductionReady();
    const implementationWarnings: string[] = [];

    // Add warnings for OAuth configuration issues
    if (this.config.authMethod === 'oauth' && !this.isOAuthConfigured()) {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
      if (!clientId) {
        implementationWarnings.push('VITE_GOOGLE_CLIENT_ID is not set in environment variables');
      } else if (clientId === DEFAULT_GOOGLE_CLIENT_ID || clientId.includes('your-google-client-id')) {
        implementationWarnings.push('VITE_GOOGLE_CLIENT_ID appears to be a placeholder value');
        implementationWarnings.push('Please replace with a valid Google Client ID from Google Cloud Console');
      }
    }

    return {
      environment: this.config.environment,
      realProcessingEnabled: this.isRealProcessingEnabled(),
      apiConfigured: authConfigured,
      configErrors: this.validateRequiredConfig(),
      productionReady,
      defaultBucket: this.config.gcsDefaultBucket,
      projectId: this.config.gcpProjectId,
      implementationWarnings,
      oauthConfigured: this.isOAuthConfigured(),
      oauthClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
    };
  }

  // Auto-enable real processing when connections are successfully tested
  enableRealProcessingIfReady(): void {
    if (this.hasValidAuthentication() && !this.config.enableRealProcessing) {
      if (this.config.authMethod === 'api-gateway') {
        console.log('🎯 Auto-enabling real processing - API Gateway authentication is valid');
        this.updateConfig({ enableRealProcessing: true });
      } else if (this.config.authMethod === 'oauth' && this.isOAuthConfigured()) {
        console.log('🎯 Auto-enabling real processing - OAuth authentication is properly configured');
        this.updateConfig({ enableRealProcessing: true });
      }
    } else if (this.config.authMethod === 'oauth' && !this.isOAuthConfigured()) {
      console.log('🚫 Not enabling real processing - OAuth is not properly configured');
    }
  }

  clearConfig(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.config = {
      apiEndpoint: import.meta.env.VITE_API_ENDPOINT || 'https://your-api-gateway.com/api',
      apiKey: import.meta.env.VITE_API_KEY || '',
      environment: import.meta.env.VITE_ENVIRONMENT as any || 'development',
      gcpProjectId: import.meta.env.VITE_GCP_PROJECT_ID,
      gcsDefaultBucket: import.meta.env.VITE_GCS_DEFAULT_BUCKET,
      bigQueryDefaultDataset: import.meta.env.VITE_BIGQUERY_DEFAULT_DATASET,
      enableRealProcessing: import.meta.env.VITE_ENABLE_REAL_PROCESSING === 'true',
      maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '500', 10),
      supportedFormats: ['zip', 'shp', 'geojson', 'kml'],
      authMethod: 'oauth'
    };
    console.log('Configuration cleared and reset to defaults');
  }

  getDefaultBucket(): string {
    return this.config.gcsDefaultBucket || 'default-uploads-bucket';
  }

  forceMockMode(): void {
    this.updateConfig({ enableRealProcessing: false });
  }

  forceOAuthMode(): void {
    this.updateConfig({ authMethod: 'oauth' });
  }

  forceApiGatewayMode(): void {
    this.updateConfig({ authMethod: 'api-gateway' });
  }

  // Get OAuth configuration for UI display
  getOAuthInfo(): {
    clientId?: string;
    scopes: string[];
    redirectUri: string;
    authUrl: string;
    isConfigured: boolean;
  } {
    const redirectUri = window.location.origin + '/auth/callback';
    const scopes = [
      'https://www.googleapis.com/auth/bigquery',
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/devstorage.read_write'
    ];

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID;

    return {
      clientId,
      scopes,
      redirectUri,
      authUrl: 'https://accounts.google.com/oauth2/v2/auth',
      isConfigured: this.isOAuthConfigured()
    };
  }
}

export const configService = new ConfigService();