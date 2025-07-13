export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface Job {
  id: string;
  userId: string;
  status: 'queued' | 'converting' | 'reading' | 'loading' | 'completed' | 'failed';
  progress: number;
  sourceType: 'local' | 'gcs';
  fileName?: string;
  gcsPath?: string;
  gcpProjectId: string;
  targetTable: string;
  schema?: any;
  integerColumns?: string;
  startTime: Date;
  endTime?: Date;
  errorMessage?: string;
  logs: JobLog[];
  bigQueryJobId?: string; // Store BigQuery job ID for manual status checking
  previewGeoJson?: any;
}

export interface JobLog {
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface SchemaField {
  name: string;
  type: 'STRING' | 'INTEGER' | 'FLOAT' | 'BOOLEAN' | 'TIMESTAMP' | 'GEOGRAPHY' | 'JSON';
  mode: 'REQUIRED' | 'NULLABLE' | 'REPEATED';
  description?: string;
}

export interface ProcessingConfig {
  destination: 'bigquery' | 'postgres';
  sourceType: 'local' | 'gcs';
  file?: File;
  gcsPath?: string;
  gcsBucket?: string;
  gcpProjectId: string;
  targetTable: string;
  autoDetectSchema: boolean;
  customSchema?: SchemaField[];
  integerColumns?: string;
  // PostgreSQL specific fields
  pgHost?: string;
  pgPort?: number;
  pgDatabase?: string;
  pgUser?: string;
  pgPassword?: string;
  pgTable?: string;
}

export interface ProcessingJob {
  id: string;
  fileName: string;
  fileSize: number;
  gcsPath: string;
  schema: any;
  datasetId: string;
  tableId: string;
  status: 'pending' | 'uploading' | 'processing' | 'loading' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  lastUpdated: Date;
  error?: string;
  bigQueryJobId?: string;
  recordCount?: number;
  processedFileUrl?: string;
  logs: JobLog[];
  sourceType: 'local' | 'gcs';
  gcpProjectId: string;
}

export interface BigQueryJobStatus {
  status: 'PENDING' | 'RUNNING' | 'DONE';
  errors?: Array<{ message: string; reason: string }>;
  statistics?: {
    load?: {
      outputRows: string;
      outputBytes: string;
    };
  };
}