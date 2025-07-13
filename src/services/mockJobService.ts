import { Job, JobLog, ProcessingConfig } from '@/types';

// Mock job storage
let jobs: Job[] = [];
let jobCounter = 1;

// Enhanced job processing with proper validation and feedback
const processJob = async (job: Job): Promise<void> => {
  const addLog = (level: 'info' | 'warn' | 'error', message: string) => {
    const jobIndex = jobs.findIndex((j) => j.id === job.id);
    if (jobIndex !== -1) {
      jobs[jobIndex].logs.push({
        timestamp: new Date(),
        level,
        message
      });
    }
  };

  const updateStatus = (status: Job['status'], progress: number = 0) => {
    const jobIndex = jobs.findIndex((j) => j.id === job.id);
    if (jobIndex !== -1) {
      jobs[jobIndex].status = status;
      jobs[jobIndex].progress = progress;
    }
  };

  try {
    // Validate job configuration
    addLog('info', 'Starting job validation...');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!job.gcpProjectId || !job.targetTable) {
      throw new Error('Missing required configuration: GCP Project ID and target table are required');
    }

    if (!job.targetTable.includes('.')) {
      throw new Error('Invalid target table format. Expected format: dataset.table_name');
    }

    if (job.sourceType === 'local' && !job.fileName) {
      throw new Error('No file uploaded for processing');
    }

    if (job.sourceType === 'gcs' && !job.gcsPath) {
      throw new Error('GCS path not specified');
    }

    addLog('info', 'Configuration validation completed successfully');

    // File conversion phase
    updateStatus('converting', 10);
    addLog('info', 'Converting shapefile to GeoJSON format...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate file format validation
    if (job.fileName && !job.fileName.toLowerCase().endsWith('.zip')) {
      addLog('warn', 'File should be a ZIP archive containing shapefile components');
    }

    updateStatus('converting', 30);
    addLog('info', 'Extracting shapefile components (.shp, .shx, .dbf)...');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Reading and parsing phase
    updateStatus('reading', 50);
    addLog('info', 'Reading geospatial features and attributes...');
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Simulate schema detection
    const mockRecordCount = Math.floor(Math.random() * 5000) + 100;
    addLog('info', `Detected ${mockRecordCount} features in the dataset`);

    if (job.integerColumns) {
      addLog('info', `Applying integer type conversion for columns: ${job.integerColumns}`);
    }

    updateStatus('reading', 70);
    addLog('info', 'Validating geometry and fixing potential issues...');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // BigQuery loading phase
    updateStatus('loading', 80);
    addLog('info', `Connecting to BigQuery project: ${job.gcpProjectId}`);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Critical validation: Check if this is actually connected to real BigQuery
    addLog('warn', 'DEMO MODE: This is a simulation. In production, data would be loaded to BigQuery.');
    addLog('info', `Target table: ${job.targetTable}`);
    addLog('info', 'Creating table schema from geospatial data...');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    updateStatus('loading', 90);
    addLog('info', 'Inserting records into BigQuery table...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Complete the job
    updateStatus('completed', 100);
    const finalJobIndex = jobs.findIndex((j) => j.id === job.id);
    if (finalJobIndex !== -1) {
      jobs[finalJobIndex].endTime = new Date();
      addLog('info', `✅ Job completed successfully! ${mockRecordCount} records processed.`);
      addLog('warn', '⚠️  IMPORTANT: This is a demo simulation. No actual data was loaded to BigQuery.');
      addLog('info', 'To load real data, you need to configure actual GCP credentials and BigQuery access.');
    }

  } catch (error) {
    // Handle errors properly
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const jobIndex = jobs.findIndex((j) => j.id === job.id);

    if (jobIndex !== -1) {
      jobs[jobIndex].status = 'failed';
      jobs[jobIndex].endTime = new Date();
      jobs[jobIndex].errorMessage = errorMessage;
      addLog('error', `Job failed: ${errorMessage}`);
      addLog('info', 'Common solutions:');
      addLog('info', '1. Verify GCP Project ID is correct');
      addLog('info', '2. Ensure BigQuery dataset exists');
      addLog('info', '3. Check that uploaded file is a valid shapefile ZIP');
      addLog('info', '4. Verify you have BigQuery write permissions');
    }
  }
};

export const jobService = {
  async createJob(config: ProcessingConfig, userId: string): Promise<Job> {
    // Enhanced validation before job creation
    const validationErrors: string[] = [];

    if (!config.gcpProjectId?.trim()) {
      validationErrors.push('GCP Project ID is required');
    }

    if (!config.targetTable?.trim()) {
      validationErrors.push('BigQuery target table is required');
    } else if (!config.targetTable.includes('.')) {
      validationErrors.push('Target table must include dataset (format: dataset.table)');
    }

    if (config.sourceType === 'local' && !config.file) {
      validationErrors.push('File upload is required for local processing');
    }

    if (config.sourceType === 'gcs' && (!config.gcsPath || !config.gcsBucket)) {
      validationErrors.push('GCS bucket and path are required for GCS processing');
    }

    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    const job: Job = {
      id: `job_${jobCounter++}`,
      userId,
      status: 'queued',
      progress: 0,
      sourceType: config.sourceType,
      fileName: config.file?.name,
      gcsPath: config.gcsPath,
      gcpProjectId: config.gcpProjectId,
      targetTable: config.targetTable,
      schema: config.customSchema,
      integerColumns: config.integerColumns,
      startTime: new Date(),
      logs: [{
        timestamp: new Date(),
        level: 'info',
        message: 'Job created and queued for processing'
      }, {
        timestamp: new Date(),
        level: 'info',
        message: `Source: ${config.sourceType.toUpperCase()} | Target: ${config.targetTable}`
      }]
    };

    jobs.push(job);

    // Start processing asynchronously
    setTimeout(() => processJob(job), 1000);

    return job;
  },

  async getJobs(userId: string): Promise<Job[]> {
    return jobs.filter((job) => job.userId === userId).sort((a, b) =>
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  },

  async getJob(jobId: string): Promise<Job | null> {
    return jobs.find((job) => job.id === jobId) || null;
  },

  // Real-time updates simulation
  subscribeToJobUpdates(jobId: string, callback: (job: Job) => void): () => void {
    const interval = setInterval(() => {
      const job = jobs.find((j) => j.id === jobId);
      if (job) {
        callback(job);
      }
    }, 1000);

    return () => clearInterval(interval);
  },

  // New method to get processing insights
  async getProcessingStats(): Promise<{
    totalJobs: number;
    successRate: number;
    avgProcessingTime: number;
    commonErrors: string[];
  }> {
    const completedJobs = jobs.filter((j) => j.status === 'completed' || j.status === 'failed');
    const successfulJobs = jobs.filter((j) => j.status === 'completed');

    const avgTime = completedJobs.length > 0 ?
    completedJobs.reduce((sum, job) => {
      if (job.endTime) {
        return sum + (job.endTime.getTime() - job.startTime.getTime());
      }
      return sum;
    }, 0) / completedJobs.length :
    0;

    const commonErrors = jobs.
    filter((j) => j.status === 'failed' && j.errorMessage).
    map((j) => j.errorMessage!).
    reduce((acc, error) => {
      acc[error] = (acc[error] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalJobs: jobs.length,
      successRate: completedJobs.length > 0 ? successfulJobs.length / completedJobs.length * 100 : 0,
      avgProcessingTime: avgTime,
      commonErrors: Object.keys(commonErrors).sort((a, b) => commonErrors[b] - commonErrors[a])
    };
  }
};