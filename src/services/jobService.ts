// Export both services - the app will choose based on configuration
import { jobService as mockJobService } from './mockJobService';
import { productionJobService } from './productionJobService';
import { configService } from './configService';
import { ProcessingConfig, Job } from '@/types';

// Dynamic service selector that checks configuration in real-time
class DynamicJobService {
  private getCurrentService() {
    const isProductionReady = configService.isRealProcessingEnabled();
    const config = configService.getConfig();

    console.log('🔧 DynamicJobService: Selecting service', {
      isProductionReady,
      authMethod: config.authMethod,
      hasApiKey: !!config.apiKey,
      enableRealProcessing: config.enableRealProcessing,
      serviceSelected: isProductionReady ? 'PRODUCTION' : 'MOCK'
    });

    if (isProductionReady) {
      console.log('✅ Using PRODUCTION service - real GCP operations will be performed');
      return productionJobService;
    } else {
      console.log('🎭 Using MOCK service - simulated operations for demonstration');

      // Log why mock mode is being used
      if (!config.enableRealProcessing) {
        console.log('   Reason: Real processing is disabled in configuration');
      } else if (config.authMethod === 'api-gateway' && !config.apiKey) {
        console.log('   Reason: API key not configured for API Gateway mode');
      } else if (config.authMethod === 'oauth' && !configService.getEnvironmentInfo().oauthConfigured) {
        console.log('   Reason: OAuth is not properly configured');
      } else {
        console.log('   Reason: Production requirements not met');
      }

      return mockJobService;
    }
  }

  // Delegate all methods to the appropriate service
  async createJob(config: ProcessingConfig, userId: string): Promise<Job> {
    return this.getCurrentService().createJob(config, userId);
  }

  async getJobs(userId: string): Promise<Job[]> {
    return this.getCurrentService().getJobs(userId);
  }

  async getJob(jobId: string): Promise<Job | null> {
    return this.getCurrentService().getJob(jobId);
  }

  subscribeToJobUpdates(jobId: string, callback: (job: Job) => void): () => void {
    return this.getCurrentService().subscribeToJobUpdates(jobId, callback);
  }

  isUsingProductionService(): boolean {
    return configService.isRealProcessingEnabled();
  }

  // Helper method to get current service info
  getServiceInfo(): {
    mode: 'production' | 'mock';
    authMethod: string;
    ready: boolean;
    warnings: string[];
  } {
    const config = configService.getConfig();
    const isProduction = this.isUsingProductionService();
    const warnings: string[] = [];

    if (!isProduction && config.enableRealProcessing) {
      warnings.push('Real processing is enabled but requirements are not met');
    }

    return {
      mode: isProduction ? 'production' : 'mock',
      authMethod: config.authMethod || 'oauth',
      ready: isProduction,
      warnings
    };
  }
}

export const jobService = new DynamicJobService();