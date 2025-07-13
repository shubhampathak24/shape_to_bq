import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { productionJobService } from '@/services/productionJobService';
import { configService } from '@/services/configService';
import { BigQueryJobStatus } from '@/types';
import { Search, CheckCircle, Clock, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';

const BigQueryJobChecker: React.FC = () => {
  const { toast } = useToast();
  const [projectId, setProjectId] = useState(configService.getConfig().gcpProjectId || '');
  const [jobId, setJobId] = useState('');
  const [jobStatus, setJobStatus] = useState<BigQueryJobStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckStatus = async () => {
    if (!projectId.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a GCP Project ID',
        variant: 'destructive'
      });
      return;
    }

    if (!jobId.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a BigQuery Job ID',
        variant: 'destructive'
      });
      return;
    }

    setIsChecking(true);
    setError(null);
    setJobStatus(null);

    try {
      console.log('🔍 Checking BigQuery job status:', { projectId, jobId });

      const status = await productionJobService.checkBigQueryJobStatus(projectId, jobId);
      setJobStatus(status);

      if (status.status === 'DONE' && (!status.errors || status.errors.length === 0)) {
        toast({
          title: 'Job Completed Successfully',
          description: `Job ${jobId} has completed successfully`,
          variant: 'default'
        });
      } else if (status.status === 'DONE' && status.errors && status.errors.length > 0) {
        toast({
          title: 'Job Failed',
          description: 'Job completed but with errors. Check details below.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Job Status Retrieved',
          description: `Job is currently ${status.status.toLowerCase()}`,
          variant: 'default'
        });
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check job status';
      setError(errorMessage);
      console.error('❌ Failed to check job status:', err);

      toast({
        title: 'Status Check Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DONE':
        return jobStatus?.errors && jobStatus.errors.length > 0 ?
        <XCircle className="h-4 w-4 text-red-500" data-id="bh8pnctw4" data-path="src/components/diagnostics/BigQueryJobChecker.tsx" /> :
        <CheckCircle className="h-4 w-4 text-green-500" data-id="wani0j465" data-path="src/components/diagnostics/BigQueryJobChecker.tsx" />;
      case 'RUNNING':
        return <Clock className="h-4 w-4 text-blue-500" data-id="6vt0xgg3s" data-path="src/components/diagnostics/BigQueryJobChecker.tsx" />;
      case 'PENDING':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" data-id="4wphhqcug" data-path="src/components/diagnostics/BigQueryJobChecker.tsx" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" data-id="64b82wxsp" data-path="src/components/diagnostics/BigQueryJobChecker.tsx" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE':
        return jobStatus?.errors && jobStatus.errors.length > 0 ? 'destructive' : 'default';
      case 'RUNNING':
        return 'secondary';
      case 'PENDING':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const openBigQueryConsole = () => {
    if (projectId) {
      const url = `https://console.cloud.google.com/bigquery?project=${projectId}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Card data-id="hbcq9gqst" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
      <CardHeader data-id="j3yhrxvx5" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
        <CardTitle className="flex items-center gap-2" data-id="klz2g89tk" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
          <Search className="h-5 w-5" data-id="10kvvudqn" data-path="src/components/diagnostics/BigQueryJobChecker.tsx" />
          BigQuery Job Status Checker
        </CardTitle>
        <CardDescription data-id="ntgwmv7ha" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
          Check the status of BigQuery jobs manually. Use this when jobs timeout or you need to verify completion.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4" data-id="qthop686p" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="88xy32rni" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
          <div className="space-y-2" data-id="ryotrbnuu" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
            <Label htmlFor="projectId" data-id="vuslq5cl1" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">GCP Project ID</Label>
            <Input
              id="projectId"
              placeholder="your-gcp-project-id"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)} data-id="b0soai3ll" data-path="src/components/diagnostics/BigQueryJobChecker.tsx" />

          </div>
          <div className="space-y-2" data-id="7d0xbc5ed" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
            <Label htmlFor="jobId" data-id="v6m3hk24a" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">BigQuery Job ID</Label>
            <Input
              id="jobId"
              placeholder="job_1234567890_abcdefghij"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)} data-id="llvvy16hm" data-path="src/components/diagnostics/BigQueryJobChecker.tsx" />

          </div>
        </div>

        <div className="flex gap-2" data-id="0sfsmd5la" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
          <Button
            onClick={handleCheckStatus}
            disabled={isChecking || !projectId.trim() || !jobId.trim()}
            className="flex-1" data-id="d3dwl83yh" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">

            {isChecking ?
            <>
                <Clock className="h-4 w-4 mr-2 animate-spin" data-id="9uadanhvx" data-path="src/components/diagnostics/BigQueryJobChecker.tsx" />
                Checking...
              </> :

            <>
                <Search className="h-4 w-4 mr-2" data-id="b6fjwxj90" data-path="src/components/diagnostics/BigQueryJobChecker.tsx" />
                Check Status
              </>
            }
          </Button>
          
          <Button
            variant="outline"
            onClick={openBigQueryConsole}
            disabled={!projectId.trim()} data-id="7ms4i3x9w" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">

            <ExternalLink className="h-4 w-4 mr-2" data-id="1yqsasjzq" data-path="src/components/diagnostics/BigQueryJobChecker.tsx" />
            Open Console
          </Button>
        </div>

        {error &&
        <Alert variant="destructive" data-id="ksjzikml1" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
            <XCircle className="h-4 w-4" data-id="qixhobpzn" data-path="src/components/diagnostics/BigQueryJobChecker.tsx" />
            <AlertDescription data-id="qwnv18ugc" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
              <strong data-id="6zv0zqsaj" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">Error:</strong> {error}
            </AlertDescription>
          </Alert>
        }

        {jobStatus &&
        <div className="space-y-4" data-id="avcxm3p5f" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
            <Separator data-id="iojxonpfu" data-path="src/components/diagnostics/BigQueryJobChecker.tsx" />
            
            <div className="space-y-3" data-id="ri75lxxx6" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
              <div className="flex items-center justify-between" data-id="xf7tpkulw" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
                <h4 className="font-medium" data-id="1v2za8pun" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">Job Status</h4>
                <Badge variant={getStatusColor(jobStatus.status)} className="flex items-center gap-1" data-id="v9q4jybal" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
                  {getStatusIcon(jobStatus.status)}
                  {jobStatus.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" data-id="pel8rha36" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
                <div data-id="fpoma38yy" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
                  <strong data-id="m6baz1m11" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">Project ID:</strong> {projectId}
                </div>
                <div data-id="wblyasxo7" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
                  <strong data-id="2h147zpnm" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">Job ID:</strong> {jobId}
                </div>
              </div>

              {jobStatus.statistics?.load &&
            <div className="space-y-2" data-id="cia9buri6" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
                  <h5 className="font-medium text-sm" data-id="qm9apchc8" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">Load Statistics</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" data-id="m4s0kftlh" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
                    <div data-id="ka3fxt2vw" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
                      <strong data-id="h0g8q92fb" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">Rows Loaded:</strong> {parseInt(jobStatus.statistics.load.outputRows || '0').toLocaleString()}
                    </div>
                    <div data-id="dhnh8g4oh" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
                      <strong data-id="3a63dabq9" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">Bytes Processed:</strong> {(parseInt(jobStatus.statistics.load.outputBytes || '0') / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
            }

              {jobStatus.errors && jobStatus.errors.length > 0 &&
            <div className="space-y-2" data-id="a8fscvab5" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
                  <h5 className="font-medium text-sm text-red-600" data-id="yhcj8wdlc" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">Errors</h5>
                  <div className="space-y-1" data-id="fza3gok2d" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
                    {jobStatus.errors.map((error, index) =>
                <Alert key={index} variant="destructive" data-id="h1rpyoe4y" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
                        <AlertDescription data-id="35stdau04" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
                          <strong data-id="klgmtav1o" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">{error.reason}:</strong> {error.message}
                        </AlertDescription>
                      </Alert>
                )}
                  </div>
                </div>
            }

              {jobStatus.status === 'DONE' && (!jobStatus.errors || jobStatus.errors.length === 0) &&
            <Alert data-id="sc8xzirpn" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
                  <CheckCircle className="h-4 w-4" data-id="cwtzvuchm" data-path="src/components/diagnostics/BigQueryJobChecker.tsx" />
                  <AlertDescription data-id="qf5fzsq5x" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
                    <strong data-id="lpm37a8at" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">Success!</strong> The BigQuery job has completed successfully. 
                    {jobStatus.statistics?.load &&
                <> {parseInt(jobStatus.statistics.load.outputRows || '0').toLocaleString()} rows were loaded.</>
                }
                  </AlertDescription>
                </Alert>
            }

              {jobStatus.status === 'RUNNING' &&
            <Alert data-id="ovoik0hjb" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
                  <Clock className="h-4 w-4" data-id="1fbp8yffo" data-path="src/components/diagnostics/BigQueryJobChecker.tsx" />
                  <AlertDescription data-id="qcdlgzi0c" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
                    <strong data-id="u02vv195y" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">In Progress:</strong> The BigQuery job is still running. Large datasets can take 30+ minutes to process.
                  </AlertDescription>
                </Alert>
            }

              {jobStatus.status === 'PENDING' &&
            <Alert data-id="ppxd81357" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
                  <AlertTriangle className="h-4 w-4" data-id="nm5pnk6mw" data-path="src/components/diagnostics/BigQueryJobChecker.tsx" />
                  <AlertDescription data-id="qsjjmxh65" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
                    <strong data-id="a7sa2e5yy" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">Pending:</strong> The BigQuery job is queued and waiting to start.
                  </AlertDescription>
                </Alert>
            }
            </div>
          </div>
        }

        <div className="text-xs text-muted-foreground space-y-1" data-id="k414tycbc" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
          <p data-id="0cjchb72j" data-path="src/components/diagnostics/BigQueryJobChecker.tsx"><strong data-id="dgiy0dj2z" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">How to find job IDs:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2" data-id="hu2gcuadr" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">
            <li data-id="sf7k1eh8e" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">Check failed job logs above for "BigQuery load job started: [job_id]"</li>
            <li data-id="qtwybam5r" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">Visit BigQuery console and check the job history</li>
            <li data-id="n54jkequd" data-path="src/components/diagnostics/BigQueryJobChecker.tsx">Job IDs typically start with "job_" followed by timestamp and random string</li>
          </ul>
        </div>
      </CardContent>
    </Card>);

};

export default BigQueryJobChecker;