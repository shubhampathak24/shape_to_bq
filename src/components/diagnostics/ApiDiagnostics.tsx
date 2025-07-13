import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { configService } from '@/services/configService';
import { fileProcessingService } from '@/services/fileProcessingService';
import { bigQueryService } from '@/services/bigqueryService';
import { CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw, Network, Database, Upload } from 'lucide-react';

interface DiagnosticResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: string[];
  icon: React.ReactNode;
}

const ApiDiagnostics = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const { toast } = useToast();

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" data-id="m6gyopp7a" data-path="src/components/diagnostics/ApiDiagnostics.tsx" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" data-id="v2ei6u9cf" data-path="src/components/diagnostics/ApiDiagnostics.tsx" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" data-id="o9umbg2hq" data-path="src/components/diagnostics/ApiDiagnostics.tsx" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" data-id="wxtnh0ks7" data-path="src/components/diagnostics/ApiDiagnostics.tsx" />;
    }
  };

  const getStatusBadge = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800" data-id="jsk1x85w8" data-path="src/components/diagnostics/ApiDiagnostics.tsx">Success</Badge>;
      case 'error':
        return <Badge variant="destructive" data-id="je72k66a5" data-path="src/components/diagnostics/ApiDiagnostics.tsx">Failed</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800" data-id="vmxkl84o4" data-path="src/components/diagnostics/ApiDiagnostics.tsx">Warning</Badge>;
      case 'pending':
        return <Badge variant="outline" data-id="x2d6akb39" data-path="src/components/diagnostics/ApiDiagnostics.tsx">Pending</Badge>;
    }
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);

    const diagnostics: DiagnosticResult[] = [
    {
      name: 'Configuration Check',
      status: 'pending',
      message: 'Checking application configuration...',
      icon: <Network className="h-5 w-5" data-id="6m5gcaof9" data-path="src/components/diagnostics/ApiDiagnostics.tsx" />
    },
    {
      name: 'API Connection Test',
      status: 'pending',
      message: 'Testing file processing API connection...',
      icon: <Upload className="h-5 w-5" data-id="htg6kjpbb" data-path="src/components/diagnostics/ApiDiagnostics.tsx" />
    },
    {
      name: 'BigQuery Connection Test',
      status: 'pending',
      message: 'Testing BigQuery connection...',
      icon: <Database className="h-5 w-5" data-id="ixui8rw3c" data-path="src/components/diagnostics/ApiDiagnostics.tsx" />
    }];


    setResults([...diagnostics]);

    // Test 1: Configuration Check
    try {
      const config = configService.getConfig();
      const envInfo = configService.getEnvironmentInfo();

      let configStatus: DiagnosticResult['status'] = 'success';
      let configMessage = 'Configuration is valid';
      const configDetails: string[] = [];

      if (!envInfo.productionReady) {
        configStatus = 'warning';
        configMessage = 'Configuration has issues';
      }

      if (envInfo.configErrors.length > 0) {
        configStatus = 'error';
        configMessage = 'Configuration errors found';
        configDetails.push(...envInfo.configErrors);
      }

      configDetails.push(`Environment: ${envInfo.environment}`);
      configDetails.push(`Auth Method: ${config.authMethod}`);
      configDetails.push(`Real Processing: ${envInfo.realProcessingEnabled ? 'Enabled' : 'Disabled'}`);
      configDetails.push(`API Configured: ${envInfo.apiConfigured ? 'Yes' : 'No'}`);

      diagnostics[0] = {
        ...diagnostics[0],
        status: configStatus,
        message: configMessage,
        details: configDetails
      };

      setResults([...diagnostics]);
    } catch (error) {
      diagnostics[0] = {
        ...diagnostics[0],
        status: 'error',
        message: 'Configuration check failed',
        details: [error instanceof Error ? error.message : 'Unknown error']
      };
      setResults([...diagnostics]);
    }

    // Test 2: API Connection Test
    try {
      const apiResult = await fileProcessingService.testApiConnection();

      diagnostics[1] = {
        ...diagnostics[1],
        status: apiResult.success ? 'success' : 'error',
        message: apiResult.success ? 'API connection successful' : 'API connection failed',
        details: [
        `Endpoint: ${apiResult.endpoint}`,
        `Has API Key: ${apiResult.hasApiKey ? 'Yes' : 'No'}`,
        ...(apiResult.error ? [`Error: ${apiResult.error}`] : [])]

      };

      setResults([...diagnostics]);
    } catch (error) {
      diagnostics[1] = {
        ...diagnostics[1],
        status: 'error',
        message: 'API connection test failed',
        details: [error instanceof Error ? error.message : 'Unknown error']
      };
      setResults([...diagnostics]);
    }

    // Test 3: BigQuery Connection Test
    try {
      const config = configService.getConfig();
      const projectId = config.gcpProjectId || configService.getGcpProjectFromServiceAccount();

      if (!projectId) {
        diagnostics[2] = {
          ...diagnostics[2],
          status: 'error',
          message: 'No project ID configured',
          details: ['Please configure a GCP project ID in Production Setup']
        };
      } else {
        const bqResult = await bigQueryService.testConnection(projectId);

        diagnostics[2] = {
          ...diagnostics[2],
          status: bqResult ? 'success' : 'error',
          message: bqResult ? 'BigQuery connection successful' : 'BigQuery connection failed',
          details: [
          `Project ID: ${projectId}`,
          `Auth Method: ${config.authMethod}`,
          ...(config.authMethod === 'service-account' ? [
          `Service Account Key: ${config.serviceAccountKey ? 'Configured' : 'Not configured'}`] :
          [
          `API Key: ${config.apiKey ? 'Configured' : 'Not configured'}`])]


        };
      }

      setResults([...diagnostics]);
    } catch (error) {
      diagnostics[2] = {
        ...diagnostics[2],
        status: 'error',
        message: 'BigQuery connection test failed',
        details: [error instanceof Error ? error.message : 'Unknown error']
      };
      setResults([...diagnostics]);
    }

    setIsRunning(false);

    // Show summary toast
    const successCount = diagnostics.filter((d) => d.status === 'success').length;
    const errorCount = diagnostics.filter((d) => d.status === 'error').length;
    const warningCount = diagnostics.filter((d) => d.status === 'warning').length;

    if (errorCount > 0) {
      toast({
        title: "Diagnostics Complete",
        description: `${errorCount} errors, ${warningCount} warnings, ${successCount} successful`,
        variant: "destructive"
      });
    } else if (warningCount > 0) {
      toast({
        title: "Diagnostics Complete",
        description: `${warningCount} warnings found, ${successCount} successful`
      });
    } else {
      toast({
        title: "Diagnostics Complete",
        description: "All tests passed successfully!"
      });
    }
  };

  return (
    <Card data-id="5jv44dvy4" data-path="src/components/diagnostics/ApiDiagnostics.tsx">
      <CardHeader data-id="dc7vy63p8" data-path="src/components/diagnostics/ApiDiagnostics.tsx">
        <CardTitle className="flex items-center gap-2" data-id="cg5w4atvr" data-path="src/components/diagnostics/ApiDiagnostics.tsx">
          <Network className="h-5 w-5" data-id="3x3sa3hes" data-path="src/components/diagnostics/ApiDiagnostics.tsx" />
          API Diagnostics
        </CardTitle>
        <CardDescription data-id="qimlemcxh" data-path="src/components/diagnostics/ApiDiagnostics.tsx">
          Test your API connections and configuration to troubleshoot issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4" data-id="ex7xtwvzs" data-path="src/components/diagnostics/ApiDiagnostics.tsx">
        <Button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="w-full" data-id="elqp12pv7" data-path="src/components/diagnostics/ApiDiagnostics.tsx">

          {isRunning ?
          <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" data-id="uen98q37m" data-path="src/components/diagnostics/ApiDiagnostics.tsx" />
              Running Diagnostics...
            </> :

          <>
              <RefreshCw className="mr-2 h-4 w-4" data-id="2a2wx0zwb" data-path="src/components/diagnostics/ApiDiagnostics.tsx" />
              Run Diagnostics
            </>
          }
        </Button>

        {results.length > 0 &&
        <div className="space-y-4" data-id="4wm3ceud4" data-path="src/components/diagnostics/ApiDiagnostics.tsx">
            <Separator data-id="vhwtuu3rm" data-path="src/components/diagnostics/ApiDiagnostics.tsx" />
            <div className="space-y-3" data-id="1uhiru1wg" data-path="src/components/diagnostics/ApiDiagnostics.tsx">
              {results.map((result, index) =>
            <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg" data-id="0ww2uds08" data-path="src/components/diagnostics/ApiDiagnostics.tsx">
                  <div className="flex-shrink-0 mt-0.5" data-id="bdotbqmth" data-path="src/components/diagnostics/ApiDiagnostics.tsx">
                    {getStatusIcon(result.status)}
                  </div>
                  <div className="flex-1 min-w-0" data-id="sm5kj2mlh" data-path="src/components/diagnostics/ApiDiagnostics.tsx">
                    <div className="flex items-center justify-between" data-id="be8cltc2o" data-path="src/components/diagnostics/ApiDiagnostics.tsx">
                      <h4 className="text-sm font-medium text-gray-900" data-id="3qjrz415m" data-path="src/components/diagnostics/ApiDiagnostics.tsx">
                        {result.name}
                      </h4>
                      {getStatusBadge(result.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1" data-id="eto3yto29" data-path="src/components/diagnostics/ApiDiagnostics.tsx">
                      {result.message}
                    </p>
                    {result.details && result.details.length > 0 &&
                <div className="mt-2" data-id="z0qmxjhqe" data-path="src/components/diagnostics/ApiDiagnostics.tsx">
                        <ul className="text-xs text-gray-500 space-y-1" data-id="h542u1gth" data-path="src/components/diagnostics/ApiDiagnostics.tsx">
                          {result.details.map((detail, detailIndex) =>
                    <li key={detailIndex} className="flex items-center" data-id="kh9s3rebn" data-path="src/components/diagnostics/ApiDiagnostics.tsx">
                              <span className="w-2 h-2 bg-gray-300 rounded-full mr-2 flex-shrink-0" data-id="4phj3n24i" data-path="src/components/diagnostics/ApiDiagnostics.tsx"></span>
                              {detail}
                            </li>
                    )}
                        </ul>
                      </div>
                }
                  </div>
                </div>
            )}
            </div>
          </div>
        }

        {results.length > 0 && results.some((r) => r.status === 'error') &&
        <Alert data-id="zry8huui4" data-path="src/components/diagnostics/ApiDiagnostics.tsx">
            <AlertTriangle className="h-4 w-4" data-id="jpzzw423t" data-path="src/components/diagnostics/ApiDiagnostics.tsx" />
            <AlertDescription data-id="g74mkrdmi" data-path="src/components/diagnostics/ApiDiagnostics.tsx">
              Some diagnostics failed. Please check your configuration in Production Setup and verify your API endpoints are accessible.
            </AlertDescription>
          </Alert>
        }

        {results.length > 0 && results.every((r) => r.status === 'success') &&
        <Alert className="border-green-200 bg-green-50" data-id="khlugtmhs" data-path="src/components/diagnostics/ApiDiagnostics.tsx">
            <CheckCircle className="h-4 w-4 text-green-600" data-id="au0f10ju7" data-path="src/components/diagnostics/ApiDiagnostics.tsx" />
            <AlertDescription className="text-green-800" data-id="43gaoqe83" data-path="src/components/diagnostics/ApiDiagnostics.tsx">
              All diagnostics passed! Your configuration is ready for processing.
            </AlertDescription>
          </Alert>
        }
      </CardContent>
    </Card>);

};

export default ApiDiagnostics;