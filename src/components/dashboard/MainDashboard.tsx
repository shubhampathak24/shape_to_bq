import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { jobService } from '@/services/jobService';
import { gcsService } from '@/services/gcsService';
import { fileProcessingService } from '@/services/fileProcessingService';
import { configService } from '@/services/configService';
import { authService } from '@/services/authService';
import { ProcessingConfig, Job } from '@/types';
import FileUploadZone from '@/components/upload/FileUploadZone';
import DestinationSelector from '@/components/destination/DestinationSelector';
import PostgresConnectionForm from '@/components/destination/PostgresConnectionForm';
import GCSPathInput from '@/components/upload/GCSPathInput';
import SchemaDefinition from '@/components/schema/SchemaDefinition';
import JobStatus from '@/components/jobs/JobStatus';
import ProductionSetup from '@/components/configuration/ProductionSetup';
import KeplerPreview from '@/components/map/KeplerPreview';
import ConnectionTest from '@/components/diagnostics/ConnectionTest';
import BigQueryJobChecker from '@/components/diagnostics/BigQueryJobChecker';
import OAuthManager from '@/components/auth/OAuthManager';
import OAuthSetupGuide from '@/components/setup/OAuthSetupGuide';
import {
  Upload,
  Settings,
  Activity,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Key,
  Info,
  BookOpen,
} from 'lucide-react';

const MainDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // State for jobs
  const [jobs, setJobs] = useState<Job[]>([]);
  const [previewGeoJson, setPreviewGeoJson] = useState<any | null>(null);
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);
  const hasPreview = useMemo(() => previewGeoJson && previewGeoJson.type === 'FeatureCollection', [previewGeoJson]);

  // Fetch GeoJSON preview once any job completes and we have an OAuth token
  useEffect(() => {
    if (isFetchingPreview) return;
    // Require a valid OAuth token first
    const token = authService.getAccessToken();
    if (!token) return;

    const job = jobs.find((j) => j.status === 'completed' && !j.previewGeoJson);
    if (!job) return;

    const { gcpProjectId, targetTable } = job;
    setIsFetchingPreview(true);

    fetch(`/api/preview-geojson?gcpProjectId=${encodeURIComponent(
      gcpProjectId
    )}&targetTable=${encodeURIComponent(targetTable)}&limit=0`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((res) => res.json())
      .then((geo) => {
        console.log('⛳ fetched preview GeoJSON', geo);
          // expose for manual inspection
          window.__previewGeo = geo as any;
          if (geo && geo.type === 'FeatureCollection') {
          console.log('Preview GeoJSON:', geo); // Add debugging log for previewGeoJson
          setPreviewGeoJson(geo);
          // Mark this job so we don't re-fetch endlessly
          setJobs((prev) => prev.map((j) =>
            j === job ? { ...j, previewGeoJson: true } : j
          ));
        }
      })
      .catch((err) => console.error('Preview fetch failed', err))
      .finally(() => setIsFetchingPreview(false));
  }, [jobs, isFetchingPreview]);

  // Processing Configuration State
  const [processingConfig, setProcessingConfig] = useState<ProcessingConfig>({
    sourceType: 'local',
    destination: 'bigquery',
    gcpProjectId: '',
    targetTable: '',
    customSchema: [],
    integerColumns: [],
    file: undefined,
    gcsBucket: '',
    gcsPath: '',
    autoDetectSchema: true,
    pgHost: '',
    pgPort: 5432,
    pgDatabase: '',
    pgUser: '',
    pgPassword: '',
    pgTable: '',
  });

  // UI State
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOAuth, setShowOAuth] = useState(false);

  // Load configuration on mount
  useEffect(() => {
    const config = configService.getConfig();
    setProcessingConfig((prev) => ({
      ...prev,
      gcpProjectId: config.gcpProjectId || '',
      targetTable: config.bigQueryDefaultDataset ? `${config.bigQueryDefaultDataset}.processed_data` : '',
    }));

    // Fetch initial jobs
    if (user) {
      jobService.getJobs(user.id).then(setJobs);
    }
  }, [user]);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      if (!authService.isAuthenticated()) {
        setShowOAuth(true);
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleProcessFile = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to process files.",
        variant: "destructive"
      });
      return;
    }

    // Validate OAuth authentication (BigQuery only)
    if (processingConfig.destination === 'bigquery' && !authService.isAuthenticated()) {
      toast({
        title: "Google OAuth Required",
        description: "Please authenticate with Google to access BigQuery and Cloud Storage.",
        variant: "destructive"
      });
      setShowOAuth(true);
      return;
    }

    // Validate processing configuration
    const errors = validateProcessingConfig();
    if (errors.length > 0) {
      toast({
        title: "Configuration Invalid",
        description: errors[0],
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      console.log('🚀 Starting job with configuration:', processingConfig);

      const job = await jobService.createJob(processingConfig, user.id);
      // If backend returns preview GeoJSON, store it for preview
      // @ts-ignore
      if (job.previewGeoJson) {
        setPreviewGeoJson(job.previewGeoJson);
      }
      setJobs((prevJobs) => [job, ...prevJobs]); // Add the new job to the list

      toast({
        title: "Processing Started! 🚀",
        description: `Job ${job.id} has been queued for processing.`
      });

      console.log('✅ Job created successfully:', job.id);

    } catch (error) {
      console.error('❌ Job creation failed:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      toast({
        title: "Processing Failed",
        description: errorMessage,
        variant: "destructive"
      });

      // Show specific guidance based on error type
      if (errorMessage.includes('authentication') || errorMessage.includes('OAuth')) {
        setShowOAuth(true);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const validateProcessingConfig = (): string[] => {
    const errors: string[] = [];

    if (processingConfig.destination === 'bigquery') {
      if (!processingConfig.gcpProjectId?.trim()) {
        errors.push('GCP Project ID is required');
      }
      if (!processingConfig.targetTable?.trim()) {
        errors.push('Target table is required');
      } else if (!processingConfig.targetTable.includes('.')) {
        errors.push('Target table must include dataset (format: dataset.table)');
      }
    }

    if (processingConfig.destination === 'postgres') {
      if (!processingConfig.pgHost?.trim()) errors.push('PostgreSQL host is required');
      if (!processingConfig.pgDatabase?.trim()) errors.push('PostgreSQL database is required');
      if (!processingConfig.pgUser?.trim()) errors.push('PostgreSQL user is required');
      if (!processingConfig.pgPassword?.trim()) errors.push('PostgreSQL password is required');
    }

    if (processingConfig.sourceType === 'local' && !processingConfig.file) {
      errors.push('Please select a file to upload');
    }

    if (processingConfig.sourceType === 'gcs') {
      if (!processingConfig.gcsBucket?.trim()) {
        errors.push('GCS bucket is required for GCS source');
      }
      if (!processingConfig.gcsPath?.trim()) {
        errors.push('GCS path is required for GCS source');
      }
    }

    // Schema validation
    if (!processingConfig.autoDetectSchema && (!processingConfig.customSchema || processingConfig.customSchema.length === 0)) {
      errors.push('Please define a custom schema or enable auto-detect schema');
    }

    return errors;
  };

  const getAuthStatus = () => {
    if (!authService.isAuthenticated()) {
      return {
        status: 'error' as const,
        message: 'Not authenticated with Google OAuth',
        action: 'Sign in required'
      };
    }

    if (authService.willExpireSoon()) {
      return {
        status: 'warning' as const,
        message: 'OAuth token will expire soon',
        action: 'Refresh recommended'
      };
    }

    return {
      status: 'success' as const,
      message: 'Authenticated and ready',
      action: 'All systems go'
    };
  };

  const authStatus = getAuthStatus();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GIS Data Processing</h1>
          <p className="text-muted-foreground">
            Process and load spatial data to BigQuery with OAuth authentication
          </p>
        </div>
        
        {/* Authentication Status */}
        <div className="flex items-center gap-2">
          {authStatus.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
          {authStatus.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
          {authStatus.status === 'error' && <Key className="h-5 w-5 text-red-500" />}
          
          <div className="text-sm">
            <div className="font-medium">{authStatus.action}</div>
            <div className="text-muted-foreground">{authStatus.message}</div>
          </div>
          
          {authStatus.status !== 'success' &&
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOAuth(true)}>

              <Key className="h-4 w-4 mr-1" />
              Authenticate
            </Button>
          }
        </div>
      </div>

      {/* OAuth Manager Modal */}
      {showOAuth &&
      <div className="mb-6">
          <OAuthManager
          onAuthSuccess={() => {
            setShowOAuth(false);
            toast({
              title: "Authentication Successful ✅",
              description: "You can now process files with Google Cloud services."
            });
          }}
          onAuthError={(error) => {
            toast({
              title: "Authentication Failed",
              description: error,
              variant: "destructive"
            });
          }} />

          
          <div className="mt-4 flex justify-center">
            <Button
            variant="ghost"
            onClick={() => setShowOAuth(false)}>

              Close
            </Button>
          </div>
        </div>
      }

      {/* Main Content */}
      <Tabs defaultValue="process" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="process" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Process
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Jobs
          </TabsTrigger>
          <TabsTrigger value="diagnostics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Diagnostics
          </TabsTrigger>
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Setup
          </TabsTrigger>
          <TabsTrigger value="checker" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Job Checker
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            OAuth Guide
          </TabsTrigger>
        </TabsList>

        {/* Processing Tab */}
        <TabsContent value="process" className="space-y-6">
          {/* Authentication Warning */}
          {!authService.isAuthenticated() &&
          <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>Google OAuth authentication is required to process files.</span>
                  <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOAuth(true)}>

                    Authenticate Now
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          }

          {/* Configuration Section */}
          <Card>
            <CardHeader>
              <CardTitle>Processing Configuration</CardTitle>
              <CardDescription>
                Configure your GCP project and target table settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Destination Selection */}
              <DestinationSelector
                value={processingConfig.destination as 'bigquery' | 'postgres'}
                onChange={(dest) => setProcessingConfig(prev => ({ ...prev, destination: dest }))}
              />

              {/* PostgreSQL Connection */}
              {processingConfig.destination === 'postgres' && (
                <PostgresConnectionForm
                  config={processingConfig}
                  onChange={(patch) => setProcessingConfig(prev => ({ ...prev, ...patch }))}
                />
              )}
              
              {processingConfig.destination === 'bigquery' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gcpProject">GCP Project ID *</Label>
                      <Input
                        id="gcpProject"
                        placeholder="your-gcp-project-id"
                        value={processingConfig.gcpProjectId}
                        onChange={(e) => setProcessingConfig((prev) => ({
                          ...prev,
                          gcpProjectId: e.target.value
                        }))} />

                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="targetTable">Target Table *</Label>
                      <Input
                        id="targetTable"
                        placeholder="dataset.table_name"
                        value={processingConfig.targetTable}
                        onChange={(e) => setProcessingConfig((prev) => ({
                          ...prev,
                          targetTable: e.target.value
                        }))} />

                    </div>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Requirements:</strong> Ensure BigQuery and Cloud Storage APIs are enabled in your GCP project. 
                      You need OAuth permissions for BigQuery and Cloud Storage access. 
                      <Button
                        variant="link"
                        className="p-0 h-auto ml-1"
                        onClick={() => setShowOAuth(true)}>

                        Click here to authenticate
                      </Button>
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </CardContent>
          </Card>

          {/* Data Source Selection */}
          <Tabs
            value={processingConfig.sourceType}
            onValueChange={(value) => setProcessingConfig((prev) => ({
              ...prev,
              sourceType: value as 'local' | 'gcs'
            }))}>

            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="local">Upload File</TabsTrigger>
              {processingConfig.destination === 'bigquery' && (
              <TabsTrigger value="gcs">GCS Path</TabsTrigger>
            )}
            </TabsList>
            
            <TabsContent value="local">
              <FileUploadZone
                onFileSelect={(file) => setProcessingConfig((prev) => ({
                  ...prev,
                  file
                }))}
                selectedFile={processingConfig.file} />

            </TabsContent>
            
            <TabsContent value="gcs">
              <GCSPathInput
                bucket={processingConfig.gcsBucket}
                path={processingConfig.gcsPath}
                onBucketChange={(bucket) => setProcessingConfig((prev) => ({
                  ...prev,
                  gcsBucket: bucket
                }))}
                onPathChange={(path) => setProcessingConfig((prev) => ({
                  ...prev,
                  gcsPath: path
                }))} />

            </TabsContent>
          </Tabs>

          {/* Schema Configuration */}
          {hasPreview && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>Interactive map sample (up to 500 features)</CardDescription>
              </CardHeader>
              <CardContent>
                {isFetchingPreview ? (
                  <div className="h-96 animate-pulse rounded-md bg-muted/30" />
                ) : (
                  <KeplerPreview geojson={previewGeoJson} />
                )}
              </CardContent>
            </Card>
          )}

          <SchemaDefinition
            autoDetectSchema={processingConfig.autoDetectSchema}
            onAutoDetectChange={(value) => setProcessingConfig((prev) => ({ ...prev, autoDetectSchema: value }))}
            customSchema={processingConfig.customSchema || []}
            onCustomSchemaChange={(schema) => setProcessingConfig((prev) => ({
              ...prev,
              customSchema: schema
            }))}
            integerColumns={processingConfig.integerColumns?.join('|') || ''}
            onIntegerColumnsChange={(columns) => setProcessingConfig((prev) => ({
              ...prev,
              integerColumns: columns.split('|').filter((col) => col.trim())
            }))}
            disabled={isProcessing}
          />


          {/* Process Button */}
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={handleProcessFile}
                disabled={isProcessing || !authService.isAuthenticated()}
                className="w-full"
                size="lg">

                {isProcessing ?
                <>
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </> :

                <>
                    <Upload className="h-4 w-4 mr-2" />
                    Start Processing
                  </>
                }
              </Button>
              
              {!authService.isAuthenticated() &&
              <p className="text-center text-sm text-muted-foreground mt-2">
                  Please authenticate with Google OAuth to continue. 
                  <Button
                  variant="link"
                  className="p-0 h-auto ml-1"
                  onClick={() => setShowOAuth(true)}>

                    Sign in now
                  </Button>
                </p>
              }
            </CardContent>
          </Card>
        </TabsContent>

        {/* Job Status Tab */}
        <TabsContent value="status">
          <JobStatus jobs={jobs} onJobsUpdate={setJobs} />
        </TabsContent>

        {/* Diagnostics Tab */}
        <TabsContent value="diagnostics">
          <ConnectionTest />
        </TabsContent>

        {/* Setup Tab */}
        <TabsContent value="setup">
          <ProductionSetup />
        </TabsContent>

        {/* Job Checker Tab */}
        <TabsContent value="checker">
          <BigQueryJobChecker />
        </TabsContent>

        {/* OAuth Guide Tab */}
        <TabsContent value="guide">
          <OAuthSetupGuide />
        </TabsContent>
      </Tabs>
    </div>);

};

export default MainDashboard;