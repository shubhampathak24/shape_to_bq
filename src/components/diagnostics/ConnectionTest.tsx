import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { configService } from '@/services/configService';
import { bigqueryService } from '@/services/bigqueryService';
import { gcsService } from '@/services/gcsService';
import { authService } from '@/services/authService';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Database,
  Cloud,
  Key,
  HelpCircle,
  User,
  Settings } from
'lucide-react';
import OAuthManager from '@/components/auth/OAuthManager';
import GCSPermissionGuide from '@/components/troubleshooting/GCSPermissionGuide';

interface TestResult {
  name: string;
  status: 'running' | 'success' | 'error';
  message?: string;
  details?: any;
}

const ConnectionTest: React.FC = () => {
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showGCSGuide, setShowGCSGuide] = useState(false);
  const [gcsError, setGcsError] = useState<string>('');

  const tests = [
  {
    name: 'Authentication',
    description: 'Google OAuth authentication status',
    icon: Key,
    test: async () => {
      const isAuth = authService.isAuthenticated();
      if (!isAuth) {
        throw new Error('Not authenticated. Please sign in with Google OAuth.');
      }

      const testResult = await authService.testAuthentication();
      if (!testResult.success) {
        throw new Error(testResult.error || 'Authentication test failed');
      }

      return 'Google OAuth authentication successful';
    }
  },
  {
    name: 'BigQuery Connection',
    description: 'Test connection to Google BigQuery',
    icon: Database,
    test: async () => {
      const result = await bigqueryService.testConnection();
      if (!result.success) {
        throw new Error(result.error || 'BigQuery connection failed');
      }
      return `BigQuery connection successful (Project: ${result.projectId})`;
    }
  },
  {
    name: 'GCS Connection',
    description: 'Test connection to Google Cloud Storage',
    icon: Cloud,
    test: async () => {
      const result = await gcsService.testConnection();
      if (!result.success) {
        // Store the error for the troubleshooting guide
        setGcsError(result.error || 'GCS connection failed');
        throw new Error(result.error || 'GCS connection failed');
      }
      return `GCS connection successful (Bucket: ${result.bucket})`;
    }
  }];


  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setGcsError('');

    for (const test of tests) {
      // Set test as running
      setTestResults((prev) => [...prev, {
        name: test.name,
        status: 'running'
      }]);

      try {
        const message = await test.test();

        // Update test as successful
        setTestResults((prev) => prev.map((result) =>
        result.name === test.name ?
        { ...result, status: 'success', message } :
        result
        ));

        toast({
          title: `${test.name} Test Passed`,
          description: message
        });

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        // Update test as failed
        setTestResults((prev) => prev.map((result) =>
        result.name === test.name ?
        { ...result, status: 'error', message: errorMessage } :
        result
        ));

        toast({
          title: `${test.name} Test Failed`,
          description: errorMessage,
          variant: "destructive"
        });
      }
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: 'running' | 'success' | 'error') => {
    switch (status) {
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" data-id="uwzm0ld4s" data-path="src/components/diagnostics/ConnectionTest.tsx" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" data-id="cu994e0i6" data-path="src/components/diagnostics/ConnectionTest.tsx" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" data-id="nabw1fzv8" data-path="src/components/diagnostics/ConnectionTest.tsx" />;
    }
  };

  const getStatusBadge = (status: 'running' | 'success' | 'error') => {
    switch (status) {
      case 'running':
        return <Badge variant="secondary" data-id="fx408u4qt" data-path="src/components/diagnostics/ConnectionTest.tsx">Running</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-500" data-id="iffs19fsf" data-path="src/components/diagnostics/ConnectionTest.tsx">Passed</Badge>;
      case 'error':
        return <Badge variant="destructive" data-id="8bgqak0t7" data-path="src/components/diagnostics/ConnectionTest.tsx">Failed</Badge>;
    }
  };

  const currentUser = authService.getCurrentUser();
  const config = configService.getConfig();

  return (
    <div className="space-y-6" data-id="eobe7uo6w" data-path="src/components/diagnostics/ConnectionTest.tsx">
      <Card data-id="8j6ehxcco" data-path="src/components/diagnostics/ConnectionTest.tsx">
        <CardHeader data-id="8gu5ve464" data-path="src/components/diagnostics/ConnectionTest.tsx">
          <CardTitle className="flex items-center gap-2" data-id="rdhgv3227" data-path="src/components/diagnostics/ConnectionTest.tsx">
            <Settings className="h-5 w-5" data-id="3o7hmphye" data-path="src/components/diagnostics/ConnectionTest.tsx" />
            Connection Tests
          </CardTitle>
          <CardDescription data-id="ago0p70o9" data-path="src/components/diagnostics/ConnectionTest.tsx">
            Test your connections to Google Cloud services to ensure everything is configured correctly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4" data-id="fiuxy6dwl" data-path="src/components/diagnostics/ConnectionTest.tsx">
          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="l8s4n4pvh" data-path="src/components/diagnostics/ConnectionTest.tsx">
            <div className="text-center p-3 border rounded-lg" data-id="xmnuodr2m" data-path="src/components/diagnostics/ConnectionTest.tsx">
              <User className="h-8 w-8 mx-auto mb-2 text-blue-500" data-id="vfn9ov40g" data-path="src/components/diagnostics/ConnectionTest.tsx" />
              <div className="text-sm font-medium" data-id="i0zqzmgf0" data-path="src/components/diagnostics/ConnectionTest.tsx">Current User</div>
              <div className="text-xs text-muted-foreground" data-id="inscjibo9" data-path="src/components/diagnostics/ConnectionTest.tsx">
                {currentUser?.email || 'Not authenticated'}
              </div>
            </div>
            <div className="text-center p-3 border rounded-lg" data-id="jhjkrzn7g" data-path="src/components/diagnostics/ConnectionTest.tsx">
              <Cloud className="h-8 w-8 mx-auto mb-2 text-green-500" data-id="p0tqwvlmo" data-path="src/components/diagnostics/ConnectionTest.tsx" />
              <div className="text-sm font-medium" data-id="zi01g22pg" data-path="src/components/diagnostics/ConnectionTest.tsx">Project ID</div>
              <div className="text-xs text-muted-foreground" data-id="lwgwp1vb1" data-path="src/components/diagnostics/ConnectionTest.tsx">
                {config.gcpProjectId || 'Not configured'}
              </div>
            </div>
            <div className="text-center p-3 border rounded-lg" data-id="3jz7kg5oi" data-path="src/components/diagnostics/ConnectionTest.tsx">
              <Database className="h-8 w-8 mx-auto mb-2 text-purple-500" data-id="wow5zchqe" data-path="src/components/diagnostics/ConnectionTest.tsx" />
              <div className="text-sm font-medium" data-id="e8ht8rzt8" data-path="src/components/diagnostics/ConnectionTest.tsx">Dataset</div>
              <div className="text-xs text-muted-foreground" data-id="oseganwt9" data-path="src/components/diagnostics/ConnectionTest.tsx">
                {config.bigqueryDataset || 'Not configured'}
              </div>
            </div>
          </div>

          {/* Run Tests Button */}
          <Button
            onClick={runTests}
            disabled={isRunning}
            className="w-full" data-id="jenb3v85m" data-path="src/components/diagnostics/ConnectionTest.tsx">

            {isRunning ?
            <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" data-id="e1ayvz4rg" data-path="src/components/diagnostics/ConnectionTest.tsx" />
                Running Tests...
              </> :

            <>
                <RefreshCw className="h-4 w-4 mr-2" data-id="5yxk27743" data-path="src/components/diagnostics/ConnectionTest.tsx" />
                Run All Tests
              </>
            }
          </Button>

          {/* Test Results */}
          {testResults.length > 0 &&
          <div className="space-y-3" data-id="g9x0yqgi5" data-path="src/components/diagnostics/ConnectionTest.tsx">
              <Separator data-id="1a7i7gw1s" data-path="src/components/diagnostics/ConnectionTest.tsx" />
              <div className="space-y-2" data-id="k3wj53buu" data-path="src/components/diagnostics/ConnectionTest.tsx">
                {testResults.map((result, index) => {
                const test = tests[index];
                const Icon = test.icon;

                return (
                  <div key={result.name} className="flex items-center justify-between p-3 border rounded-lg" data-id="qcgmn2qgf" data-path="src/components/diagnostics/ConnectionTest.tsx">
                      <div className="flex items-center gap-3" data-id="c2kqwomd5" data-path="src/components/diagnostics/ConnectionTest.tsx">
                        <Icon className="h-4 w-4 text-gray-500" data-id="1bfi40x2k" data-path="src/components/diagnostics/ConnectionTest.tsx" />
                        <div data-id="hqyv0wvut" data-path="src/components/diagnostics/ConnectionTest.tsx">
                          <div className="font-medium" data-id="fget55cih" data-path="src/components/diagnostics/ConnectionTest.tsx">{result.name}</div>
                          <div className="text-sm text-muted-foreground" data-id="4uyn6oz8l" data-path="src/components/diagnostics/ConnectionTest.tsx">{test.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" data-id="hd446rrz4" data-path="src/components/diagnostics/ConnectionTest.tsx">
                        {getStatusIcon(result.status)}
                        {getStatusBadge(result.status)}
                      </div>
                    </div>);

              })}
              </div>
            </div>
          }

          {/* Error Messages */}
          {testResults.some((result) => result.status === 'error') &&
          <div className="space-y-2" data-id="b4szaajyj" data-path="src/components/diagnostics/ConnectionTest.tsx">
              <Separator data-id="kuvdw8tbi" data-path="src/components/diagnostics/ConnectionTest.tsx" />
              <div className="space-y-2" data-id="w9l4kmkgn" data-path="src/components/diagnostics/ConnectionTest.tsx">
                {testResults.
              filter((result) => result.status === 'error').
              map((result) =>
              <Alert key={result.name} className="border-red-200 bg-red-50" data-id="zlrqickgk" data-path="src/components/diagnostics/ConnectionTest.tsx">
                      <AlertCircle className="h-4 w-4 text-red-600" data-id="xlbkai87d" data-path="src/components/diagnostics/ConnectionTest.tsx" />
                      <AlertDescription className="text-red-800" data-id="0aite85p1" data-path="src/components/diagnostics/ConnectionTest.tsx">
                        <strong data-id="qvhcv0rf4" data-path="src/components/diagnostics/ConnectionTest.tsx">{result.name}:</strong> {result.message}
                      </AlertDescription>
                    </Alert>
              )}
              </div>
            </div>
          }

          {/* Special handling for GCS permission errors */}
          {gcsError && gcsError.includes('permission') &&
          <div className="space-y-2" data-id="in5swew06" data-path="src/components/diagnostics/ConnectionTest.tsx">
              <Alert className="border-orange-200 bg-orange-50" data-id="bagi7s321" data-path="src/components/diagnostics/ConnectionTest.tsx">
                <HelpCircle className="h-4 w-4 text-orange-600" data-id="u8zczyzab" data-path="src/components/diagnostics/ConnectionTest.tsx" />
                <AlertDescription className="text-orange-800" data-id="wis8n6jlu" data-path="src/components/diagnostics/ConnectionTest.tsx">
                  <strong data-id="17uu5fm2b" data-path="src/components/diagnostics/ConnectionTest.tsx">Permission Issue Detected:</strong> It looks like you need additional Google Cloud Storage permissions.
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2" data-id="qgcycuoox" data-path="src/components/diagnostics/ConnectionTest.tsx">
                <Dialog open={showGCSGuide} onOpenChange={setShowGCSGuide} data-id="hhum86j49" data-path="src/components/diagnostics/ConnectionTest.tsx">
                  <DialogTrigger asChild data-id="7zh406ojl" data-path="src/components/diagnostics/ConnectionTest.tsx">
                    <Button variant="outline" size="sm" data-id="0j7m4ym5q" data-path="src/components/diagnostics/ConnectionTest.tsx">
                      <HelpCircle className="h-4 w-4 mr-2" data-id="eoe2ffvce" data-path="src/components/diagnostics/ConnectionTest.tsx" />
                      How to Fix This
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" data-id="64ixzzemi" data-path="src/components/diagnostics/ConnectionTest.tsx">
                    <DialogHeader data-id="gs6fziou2" data-path="src/components/diagnostics/ConnectionTest.tsx">
                      <DialogTitle data-id="lp0n6vr1e" data-path="src/components/diagnostics/ConnectionTest.tsx">Resolve GCS Permission Issue</DialogTitle>
                      <DialogDescription data-id="cfr3mum8x" data-path="src/components/diagnostics/ConnectionTest.tsx">
                        Follow these steps to grant the required Google Cloud Storage permissions.
                      </DialogDescription>
                    </DialogHeader>
                    <GCSPermissionGuide
                    error={gcsError}
                    userEmail={currentUser?.email}
                    projectId={config.gcpProjectId} data-id="ckvg3ktph" data-path="src/components/diagnostics/ConnectionTest.tsx" />

                  </DialogContent>
                </Dialog>

                <Button
                variant="outline"
                size="sm"
                onClick={() => authService.reauthorizeWithFullScopes()} data-id="ueaujh5oy" data-path="src/components/diagnostics/ConnectionTest.tsx">

                  <Key className="h-4 w-4 mr-2" data-id="lzjsnj3h9" data-path="src/components/diagnostics/ConnectionTest.tsx" />
                  Re-authenticate
                </Button>
              </div>
            </div>
          }
        </CardContent>
      </Card>

      {/* OAuth Manager */}
      <OAuthManager data-id="ov9su3h99" data-path="src/components/diagnostics/ConnectionTest.tsx" />
    </div>);

};

export default ConnectionTest;