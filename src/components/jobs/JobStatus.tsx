import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Job } from '@/types';
import { jobService } from '@/services/jobService';
import { configService } from '@/services/configService';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Calendar,
  Database,
  FileText,
  Eye,
  AlertTriangle,
  ExternalLink,
  Zap,
  Copy,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface JobStatusProps {
  jobs: Job[];
  onJobsUpdate: (jobs: Job[]) => void;
}

const JobStatus: React.FC<JobStatusProps> = ({ jobs = [], onJobsUpdate }) => {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [isRealProcessingEnabled, setIsRealProcessingEnabled] = useState(false);

  useEffect(() => {
    // Check if real processing is enabled
    const checkRealProcessing = () => {
      setIsRealProcessingEnabled(configService.isRealProcessingEnabled());
    };

    // Initial check
    checkRealProcessing();

    // Check periodically in case configuration changes
    const interval = setInterval(checkRealProcessing, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribeFunctions: (() => void)[] = [];

    // Ensure jobs is an array before iterating
    if (Array.isArray(jobs)) {
      jobs.forEach((job) => {
        if (job.status !== 'completed' && job.status !== 'failed') {
          const unsubscribe = jobService.subscribeToJobUpdates(job.id, (updatedJob) => {
            onJobsUpdate(jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j)));
          });
          unsubscribeFunctions.push(unsubscribe);
        }
      });
    }

    return () => {
      unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
    };
  }, [jobs, onJobsUpdate]);

  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-4 w-4" />;
      case 'converting':
      case 'reading':
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'queued':
        return 'bg-gray-100 text-gray-800';
      case 'converting':
      case 'reading':
      case 'loading':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (start?: Date, end?: Date) => {
    if (!start || !(start instanceof Date) || isNaN(start.getTime())) {
      return 'N/A';
    }
    const endTime = end && end instanceof Date && !isNaN(end.getTime()) ? end : new Date();
    return formatDistanceToNow(start, { addSuffix: true, includeSeconds: true });
  };

  const getJobStatusMessage = (job: Job) => {
    if (job.status === 'completed') {
      if (isRealProcessingEnabled) {
        return '🎉 Job completed successfully! Data has been loaded to BigQuery.';
      } else {
        return 'Job completed successfully (Demo mode - no actual data loaded)';
      }
    }
    if (job.status === 'failed') {
      return job.errorMessage || 'Job failed with unknown error';
    }
    return `Processing: ${job.status}...`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Ensure jobs is an array and handle the case when it's undefined or null
  const safeJobs = Array.isArray(jobs) ? jobs : [];

  if (safeJobs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-gray-400 mb-2">
            <Database className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs yet</h3>
          <p className="text-gray-500">Your processing jobs will appear here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Processing Jobs</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{safeJobs.length} total</Badge>
          {isRealProcessingEnabled ? (
            <Badge className="bg-green-100 text-green-800">
              <Zap className="h-3 w-3 mr-1" />
              Production Mode
            </Badge>
          ) : (
            <Badge variant="secondary">Demo Mode</Badge>
          )}
        </div>
      </div>

      {/* Mode Alert - only show if in demo mode */}
      {!isRealProcessingEnabled && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Demo Mode Active:</strong> Jobs show as "completed" but no actual data is loaded to BigQuery. To enable real processing, configure your production settings and test connections in the Diagnostics tab.
          </AlertDescription>
        </Alert>
      )}

      {/* Production Mode Success Alert */}
      {isRealProcessingEnabled && safeJobs.some((job) => job.status === 'completed') && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <strong>Production Mode Active:</strong> Your jobs are processing real data and loading to BigQuery. Check the BigQuery console to view your data.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        {safeJobs.map((job) => (
          <Card key={job.id} className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded-full ${getStatusColor(job.status)}`}>{getStatusIcon(job.status)}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{job.fileName || job.gcsPath || 'Processing Job'}</h3>
                    <p className="text-sm text-gray-500">Target: {job.targetTable}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(job.status)}>{job.status?.toUpperCase()}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Status Message */}
              <div className="mb-3">
                <p
                  className={`text-sm ${
                    job.status === 'completed'
                      ? 'text-green-600'
                      : job.status === 'failed'
                      ? 'text-red-600'
                      : 'text-blue-600'
                  }`}
                >
                  {getJobStatusMessage(job)}
                </p>
              </div>

              {(job.status === 'converting' || job.status === 'reading' || job.status === 'loading') && (
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium">{job.progress}%</span>
                  </div>
                  <Progress value={job.progress} className="h-2" />
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{job.startTime ? format(new Date(job.startTime), 'MMM d, HH:mm') : 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(new Date(job.startTime), job.endTime ? new Date(job.endTime) : undefined)}</span>
                  </div>
                </div>
                {job.errorMessage && <Badge variant="destructive" className="text-xs">Error</Badge>}
              </div>

              {expandedJob === job.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Job Details</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>ID:</strong> {job.id}</p>
                        <p><strong>Source:</strong> {job.sourceType?.toUpperCase()}</p>
                        <p><strong>Project:</strong> {job.gcpProjectId}</p>
                        <p><strong>Mode:</strong> {isRealProcessingEnabled ? 'Production' : 'Demo'}</p>
                        {job.bigQueryJobId && (
                          <div className="flex items-center gap-2">
                            <strong>BigQuery Job ID:</strong>
                            <code className="bg-gray-100 px-1 rounded text-xs">{job.bigQueryJobId}</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(job.bigQueryJobId!)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        {job.integerColumns && <p><strong>Integer Columns:</strong> {job.integerColumns}</p>}
                      </div>
                    </div>
                    {job.errorMessage && (
                      <div>
                        <h4 className="text-sm font-medium text-red-700 mb-2">Error Details</h4>
                        <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                          {job.errorMessage}
                        </div>
                        {job.errorMessage.includes('BigQuery job timed out') && job.bigQueryJobId && (
                          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                            <p className="font-medium">💡 Tip:</p>
                            <p>Use the "Job Checker" tab to manually verify if job {job.bigQueryJobId} completed successfully.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* BigQuery Link for completed jobs */}
                  {job.status === 'completed' && isRealProcessingEnabled && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-800">Data Available in BigQuery</p>
                          <p className="text-xs text-green-700">
                            Your data is now available in: {job.gcpProjectId}.{job.targetTable}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://console.cloud.google.com/bigquery?project=${job.gcpProjectId}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Open BigQuery
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Demo Mode Notice for completed jobs */}
                  {job.status === 'completed' && !isRealProcessingEnabled && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Demo Mode</p>
                          <p className="text-xs text-yellow-700">
                            In production mode, your data would be available at: {job.gcpProjectId}.{job.targetTable}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://console.cloud.google.com/bigquery?project=${job.gcpProjectId}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Open BigQuery
                        </Button>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      Processing Logs
                    </h4>
                    <ScrollArea className="h-32 border rounded p-2 bg-gray-50">
                      <div className="space-y-1">
                        {/* Safe array access with fallback to empty array */}
                        {(job.logs || []).map((log, index) => (
                          <div key={index} className="text-xs">
                            <span className="text-gray-500">
                              {log.timestamp ? format(new Date(log.timestamp), 'HH:mm:ss') : 'N/A'}
                            </span>
                            <span
                              className={`ml-2 font-mono ${
                                log.level === 'error'
                                  ? 'text-red-600'
                                  : log.level === 'warn'
                                  ? 'text-yellow-600'
                                  : 'text-gray-700'
                              }`}
                            >
                              [{log.level?.toUpperCase()}] {log.message}
                            </span>
                          </div>
                        ))}
                        {/* Show message if no logs */}
                        {(!job.logs || job.logs.length === 0) && (
                          <div className="text-xs text-gray-500 italic">No logs available</div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobStatus;