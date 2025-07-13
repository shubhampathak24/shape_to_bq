import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { configService } from '@/services/configService';
import { authService } from '@/services/authService';
import { Settings, CheckCircle, AlertCircle, ExternalLink, Copy, AlertTriangle, RefreshCw, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  isConfigured: boolean;
  hasValidClientId: boolean;
}

interface ScopeValidation {
  hasRequiredScopes: boolean;
  missingScopes: string[];
  isChecking: boolean;
  lastChecked?: Date;
}

const OAuthManager: React.FC = () => {
  const [config, setConfig] = useState<OAuthConfig>({
    clientId: '',
    clientSecret: '',
    redirectUri: '',
    isConfigured: false,
    hasValidClientId: false
  });
  const [scopeValidation, setScopeValidation] = useState<ScopeValidation>({
    hasRequiredScopes: true,
    missingScopes: [],
    isChecking: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [configInfo, setConfigInfo] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadConfig();
  }, []);

  useEffect(() => {
    if (user) {
      checkScopes();
    }
  }, [user]);

  const loadConfig = async () => {
    try {
      const savedConfig = await configService.getOAuthConfig();
      const redirectUri = `${window.location.origin}/auth/callback`;
      const authConfig = authService.getConfigurationInfo();
      const validation = authService.validateOAuthConfiguration();

      setConfig({
        clientId: savedConfig.googleClientId || import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        clientSecret: savedConfig.googleClientSecret || import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
        redirectUri,
        isConfigured: authConfig.clientIdValid && authConfig.hasClientId,
        hasValidClientId: authConfig.clientIdValid
      });

      setConfigInfo({
        validation,
        authConfig
      });
    } catch (error) {
      console.error('Failed to load OAuth config:', error);
    }
  };

  const checkScopes = async () => {
    if (!user) return;

    setScopeValidation((prev) => ({ ...prev, isChecking: true }));

    try {
      console.log('Checking required scopes...');
      const hasRequiredScopes = await authService.hasRequiredScopes();
      const missingScopes = await authService.getMissingScopes();

      console.log('Scope check results:', { hasRequiredScopes, missingScopes });

      setScopeValidation({
        hasRequiredScopes,
        missingScopes,
        isChecking: false,
        lastChecked: new Date()
      });

      if (!hasRequiredScopes) {
        toast({
          title: "Missing Required Permissions",
          description: `Your authentication is missing required scopes for BigQuery and Cloud Storage access.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Scope validation error:', error);
      setScopeValidation((prev) => ({
        ...prev,
        isChecking: false,
        hasRequiredScopes: false,
        missingScopes: [
        'https://www.googleapis.com/auth/bigquery',
        'https://www.googleapis.com/auth/cloud-platform']

      }));
    }
  };

  const handleReauthenticate = async () => {
    try {
      console.log('Initiating re-authentication with full scopes...');
      toast({
        title: "Re-authenticating",
        description: "Redirecting to Google for authentication with full permissions..."
      });

      // Use the new reauthorize method that forces consent
      await authService.reauthorizeWithFullScopes();
    } catch (error: any) {
      console.error('Re-authentication failed:', error);
      toast({
        title: "Re-authentication Failed",
        description: error.message || "Failed to initiate re-authentication",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Copy failed",
        description: "Please copy manually",
        variant: "destructive"
      });
    }
  };

  const testOAuthConnection = async () => {
    setIsLoading(true);
    try {
      const validation = authService.validateOAuthConfiguration();

      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Test authentication if user is logged in
      if (user) {
        const authTest = await authService.testAuthentication();
        if (!authTest.success) {
          throw new Error(authTest.error || 'Authentication test failed');
        }

        // Check scopes
        const hasScopes = await authService.hasRequiredScopes();
        if (!hasScopes) {
          const missingScopes = await authService.getMissingScopes();
          throw new Error(`Missing required scopes: ${missingScopes.join(', ')}`);
        }
      }

      // Simulate test - in real implementation, this would verify the OAuth config
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "OAuth Configuration Valid",
        description: "Your Google OAuth setup is ready to use"
      });
    } catch (error: any) {
      toast({
        title: "OAuth Test Failed",
        description: error.message || "Please check your configuration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openGoogleConsole = () => {
    window.open('https://console.cloud.google.com/apis/credentials', '_blank');
  };

  const isPlaceholderValue = (value: string) => {
    return value.includes('your-google-client-id') ||
    value.includes('your_google_client_id') ||
    value === 'your-google-client-id.apps.googleusercontent.com';
  };

  const formatScopeName = (scope: string) => {
    if (scope.includes('bigquery')) return 'BigQuery API';
    if (scope.includes('cloud-platform')) return 'Google Cloud Platform';
    return scope.split('/').pop() || scope;
  };

  return (
    <div className="space-y-6" data-id="clxij7ska" data-path="src/components/auth/OAuthManager.tsx">
      <Card data-id="shdblq71z" data-path="src/components/auth/OAuthManager.tsx">
        <CardHeader data-id="3785c14qh" data-path="src/components/auth/OAuthManager.tsx">
          <div className="flex items-center gap-2" data-id="7emkx2gni" data-path="src/components/auth/OAuthManager.tsx">
            <Settings className="w-5 h-5" data-id="xo0olp4ou" data-path="src/components/auth/OAuthManager.tsx" />
            <CardTitle data-id="idovvs4fy" data-path="src/components/auth/OAuthManager.tsx">Google OAuth Configuration</CardTitle>
          </div>
          <CardDescription data-id="icygq6bge" data-path="src/components/auth/OAuthManager.tsx">
            Configure your Google OAuth client to enable BigQuery and Cloud Storage access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4" data-id="kovgx2k4i" data-path="src/components/auth/OAuthManager.tsx">
          {user &&
          <div className="space-y-3" data-id="y37ntveg5" data-path="src/components/auth/OAuthManager.tsx">
              <Alert data-id="nvepdmg8a" data-path="src/components/auth/OAuthManager.tsx">
                <CheckCircle className="w-4 h-4" data-id="0ru9rprex" data-path="src/components/auth/OAuthManager.tsx" />
                <AlertDescription data-id="n0ovxlndu" data-path="src/components/auth/OAuthManager.tsx">
                  Successfully authenticated as <strong data-id="1pz4xbny4" data-path="src/components/auth/OAuthManager.tsx">{user.email}</strong>
                </AlertDescription>
              </Alert>

              {/* Scope Validation Section */}
              <Card className="border-l-4 border-l-gray-200" data-id="4q57ezf31" data-path="src/components/auth/OAuthManager.tsx">
                <CardHeader className="pb-3" data-id="35nhdiotx" data-path="src/components/auth/OAuthManager.tsx">
                  <div className="flex items-center justify-between" data-id="1o82vmsep" data-path="src/components/auth/OAuthManager.tsx">
                    <div className="flex items-center gap-2" data-id="grh5egubz" data-path="src/components/auth/OAuthManager.tsx">
                      <Shield className="w-4 h-4" data-id="x0os990x5" data-path="src/components/auth/OAuthManager.tsx" />
                      <CardTitle className="text-sm" data-id="mntaqukmo" data-path="src/components/auth/OAuthManager.tsx">Permission Scopes</CardTitle>
                    </div>
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={checkScopes}
                    disabled={scopeValidation.isChecking} data-id="iee06ucno" data-path="src/components/auth/OAuthManager.tsx">

                      <RefreshCw className={`w-3 h-3 mr-1 ${scopeValidation.isChecking ? 'animate-spin' : ''}`} data-id="n3ch3x53y" data-path="src/components/auth/OAuthManager.tsx" />
                      {scopeValidation.isChecking ? 'Checking...' : 'Refresh'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3" data-id="gsz4rv5fh" data-path="src/components/auth/OAuthManager.tsx">
                  <div className="flex items-center gap-2" data-id="ikvs1aofs" data-path="src/components/auth/OAuthManager.tsx">
                    <Badge variant={scopeValidation.hasRequiredScopes ? "default" : "destructive"} data-id="ztua3ih16" data-path="src/components/auth/OAuthManager.tsx">
                      {scopeValidation.hasRequiredScopes ? "All Permissions Available" : "Missing Required Permissions"}
                    </Badge>
                    {scopeValidation.lastChecked &&
                  <span className="text-xs text-gray-500" data-id="r86jwmgqb" data-path="src/components/auth/OAuthManager.tsx">
                        Last checked: {scopeValidation.lastChecked.toLocaleTimeString()}
                      </span>
                  }
                  </div>

                  {!scopeValidation.hasRequiredScopes && scopeValidation.missingScopes.length > 0 &&
                <Alert data-id="4n10koq72" data-path="src/components/auth/OAuthManager.tsx">
                      <AlertTriangle className="w-4 h-4" data-id="o30qemgcb" data-path="src/components/auth/OAuthManager.tsx" />
                      <AlertDescription data-id="yx8jmomyc" data-path="src/components/auth/OAuthManager.tsx">
                        <div className="space-y-2" data-id="jcj9bd2xw" data-path="src/components/auth/OAuthManager.tsx">
                          <p data-id="o67vzssir" data-path="src/components/auth/OAuthManager.tsx"><strong data-id="q7s4gxz6u" data-path="src/components/auth/OAuthManager.tsx">Missing Required Permissions:</strong></p>
                          <ul className="list-disc list-inside space-y-1 text-sm" data-id="et1e92xa1" data-path="src/components/auth/OAuthManager.tsx">
                            {scopeValidation.missingScopes.map((scope, index) =>
                        <li key={index} data-id="s2ar75crr" data-path="src/components/auth/OAuthManager.tsx">{formatScopeName(scope)}</li>
                        )}
                          </ul>
                          <div className="pt-2" data-id="kwtbnm8qa" data-path="src/components/auth/OAuthManager.tsx">
                            <Button
                          onClick={handleReauthenticate}
                          variant="destructive"
                          size="sm" data-id="7u4yhjky5" data-path="src/components/auth/OAuthManager.tsx">

                              <RefreshCw className="w-3 h-3 mr-1" data-id="fah4lweso" data-path="src/components/auth/OAuthManager.tsx" />
                              Re-authenticate with Full Permissions
                            </Button>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                }

                  {scopeValidation.hasRequiredScopes &&
                <Alert data-id="cw2ojum1q" data-path="src/components/auth/OAuthManager.tsx">
                      <CheckCircle className="w-4 h-4" data-id="1ptwtqp45" data-path="src/components/auth/OAuthManager.tsx" />
                      <AlertDescription data-id="20ccm6h36" data-path="src/components/auth/OAuthManager.tsx">
                        <strong data-id="jy8wzttd0" data-path="src/components/auth/OAuthManager.tsx">All Required Permissions Available:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1 text-sm" data-id="gne5qpz3h" data-path="src/components/auth/OAuthManager.tsx">
                          <li data-id="hwc6r25ct" data-path="src/components/auth/OAuthManager.tsx">BigQuery API Access</li>
                          <li data-id="tjyfl44ai" data-path="src/components/auth/OAuthManager.tsx">Google Cloud Platform Access</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                }
                </CardContent>
              </Card>
            </div>
          }

          <div className="grid gap-4" data-id="de0q66u68" data-path="src/components/auth/OAuthManager.tsx">
            <div className="space-y-2" data-id="ghyb6wx9e" data-path="src/components/auth/OAuthManager.tsx">
              <label className="text-sm font-medium" data-id="y9cme6iau" data-path="src/components/auth/OAuthManager.tsx">Client ID</label>
              <div className="flex items-center gap-2" data-id="suwn9bmw8" data-path="src/components/auth/OAuthManager.tsx">
                <Badge variant={config.hasValidClientId ? "default" : "destructive"} data-id="l8rht52qc" data-path="src/components/auth/OAuthManager.tsx">
                  {config.hasValidClientId ? "Configured" : "Invalid/Missing"}
                </Badge>
                {config.clientId &&
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(config.clientId, 'Client ID')} data-id="r6qhyu8iq" data-path="src/components/auth/OAuthManager.tsx">
                    <Copy className="w-3 h-3 mr-1" data-id="e28d7savi" data-path="src/components/auth/OAuthManager.tsx" />
                    Copy
                  </Button>
                }
              </div>
              {config.clientId &&
              <div className="space-y-1" data-id="2ohze7rzd" data-path="src/components/auth/OAuthManager.tsx">
                  <p className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded" data-id="3r70i1hes" data-path="src/components/auth/OAuthManager.tsx">
                    {config.clientId.substring(0, 40)}...
                  </p>
                  {isPlaceholderValue(config.clientId) &&
                <Alert data-id="0dwh4o3rg" data-path="src/components/auth/OAuthManager.tsx">
                      <AlertTriangle className="w-4 h-4" data-id="wz83l8lb5" data-path="src/components/auth/OAuthManager.tsx" />
                      <AlertDescription data-id="9vso7phce" data-path="src/components/auth/OAuthManager.tsx">
                        <strong data-id="aipey0pue" data-path="src/components/auth/OAuthManager.tsx">Placeholder Value:</strong> This appears to be a placeholder value. Please set a valid Google Client ID in your .env file.
                      </AlertDescription>
                    </Alert>
                }
                </div>
              }
            </div>

            <div className="space-y-2" data-id="n32d4grgz" data-path="src/components/auth/OAuthManager.tsx">
              <label className="text-sm font-medium" data-id="ags5ojiu1" data-path="src/components/auth/OAuthManager.tsx">Client Secret</label>
              <div className="flex items-center gap-2" data-id="qr01b47f9" data-path="src/components/auth/OAuthManager.tsx">
                <Badge variant={config.clientSecret ? "default" : "destructive"} data-id="4codswp29" data-path="src/components/auth/OAuthManager.tsx">
                  {config.clientSecret ? "Configured" : "Missing"}
                </Badge>
              </div>
              {!config.clientSecret &&
              <p className="text-xs text-amber-600" data-id="er1f6wpv3" data-path="src/components/auth/OAuthManager.tsx">
                  Client secret is required to complete OAuth flow
                </p>
              }
            </div>

            <div className="space-y-2" data-id="s9u6yb4f3" data-path="src/components/auth/OAuthManager.tsx">
              <label className="text-sm font-medium" data-id="kq4u32fqy" data-path="src/components/auth/OAuthManager.tsx">Redirect URI</label>
              <div className="flex items-center gap-2" data-id="b0carce4r" data-path="src/components/auth/OAuthManager.tsx">
                <Badge variant="default" data-id="gorui28sw" data-path="src/components/auth/OAuthManager.tsx">Auto-generated</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(config.redirectUri, 'Redirect URI')} data-id="lf7e7v2dj" data-path="src/components/auth/OAuthManager.tsx">
                  <Copy className="w-3 h-3 mr-1" data-id="o89sodg0d" data-path="src/components/auth/OAuthManager.tsx" />
                  Copy
                </Button>
              </div>
              <p className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded" data-id="t4envs7l5" data-path="src/components/auth/OAuthManager.tsx">
                {config.redirectUri}
              </p>
            </div>

            <div className="space-y-2" data-id="9bt6hmlkm" data-path="src/components/auth/OAuthManager.tsx">
              <label className="text-sm font-medium" data-id="6qoxvlzhw" data-path="src/components/auth/OAuthManager.tsx">Required Scopes</label>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono space-y-1" data-id="9vu6685ux" data-path="src/components/auth/OAuthManager.tsx">
                <div data-id="cm8alk9un" data-path="src/components/auth/OAuthManager.tsx">✓ openid email profile</div>
                <div data-id="fseyk14uw" data-path="src/components/auth/OAuthManager.tsx">✓ https://www.googleapis.com/auth/bigquery</div>
                <div data-id="l7hydksrs" data-path="src/components/auth/OAuthManager.tsx">✓ https://www.googleapis.com/auth/cloud-platform</div>
              </div>
              <p className="text-xs text-gray-600" data-id="0bvs5c3rn" data-path="src/components/auth/OAuthManager.tsx">
                These scopes are automatically requested during authentication
              </p>
            </div>

            <div className="space-y-2" data-id="o4rxypihd" data-path="src/components/auth/OAuthManager.tsx">
              <label className="text-sm font-medium" data-id="7mmjcqd13" data-path="src/components/auth/OAuthManager.tsx">Configuration Status</label>
              <Badge variant={config.isConfigured ? "default" : "destructive"} data-id="qya6bdx43" data-path="src/components/auth/OAuthManager.tsx">
                {config.isConfigured ? "Ready" : "Setup Required"}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2" data-id="xbw36z7zz" data-path="src/components/auth/OAuthManager.tsx">
            <Button
              onClick={testOAuthConnection}
              disabled={isLoading || !config.hasValidClientId}
              variant="outline" data-id="a70rb0olu" data-path="src/components/auth/OAuthManager.tsx">
              {isLoading ? "Testing..." : "Test Configuration"}
            </Button>
            <Button onClick={openGoogleConsole} variant="outline" data-id="2daalufta" data-path="src/components/auth/OAuthManager.tsx">
              <ExternalLink className="w-4 h-4 mr-2" data-id="7vmc1uqua" data-path="src/components/auth/OAuthManager.tsx" />
              Open Google Console
            </Button>
          </div>

          {configInfo?.validation && configInfo.validation.errors.length > 0 &&
          <Alert data-id="p2iey3z7e" data-path="src/components/auth/OAuthManager.tsx">
              <AlertCircle className="w-4 h-4" data-id="nhblgsb55" data-path="src/components/auth/OAuthManager.tsx" />
              <AlertDescription data-id="foitviurw" data-path="src/components/auth/OAuthManager.tsx">
                <strong data-id="l5kj2ztk5" data-path="src/components/auth/OAuthManager.tsx">Configuration Issues:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1" data-id="hbtgnci36" data-path="src/components/auth/OAuthManager.tsx">
                  {configInfo.validation.errors.map((error: string, index: number) =>
                <li key={index} className="text-sm" data-id="rm22q52al" data-path="src/components/auth/OAuthManager.tsx">{error}</li>
                )}
                </ul>
              </AlertDescription>
            </Alert>
          }

          {configInfo?.validation && configInfo.validation.warnings.length > 0 &&
          <Alert data-id="blj43oagb" data-path="src/components/auth/OAuthManager.tsx">
              <AlertTriangle className="w-4 h-4" data-id="9yo2n0sbf" data-path="src/components/auth/OAuthManager.tsx" />
              <AlertDescription data-id="vagwr0w69" data-path="src/components/auth/OAuthManager.tsx">
                <strong data-id="6yn7wo8nj" data-path="src/components/auth/OAuthManager.tsx">Warnings:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1" data-id="82jkgoeub" data-path="src/components/auth/OAuthManager.tsx">
                  {configInfo.validation.warnings.map((warning: string, index: number) =>
                <li key={index} className="text-sm" data-id="2ebwt91sx" data-path="src/components/auth/OAuthManager.tsx">{warning}</li>
                )}
                </ul>
              </AlertDescription>
            </Alert>
          }
        </CardContent>
      </Card>

      <Card data-id="0zdd50uyd" data-path="src/components/auth/OAuthManager.tsx">
        <CardHeader data-id="w1jok9css" data-path="src/components/auth/OAuthManager.tsx">
          <CardTitle className="text-lg" data-id="wpms6ueul" data-path="src/components/auth/OAuthManager.tsx">Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent data-id="9aghjl1g2" data-path="src/components/auth/OAuthManager.tsx">
          <ol className="list-decimal list-inside space-y-3 text-sm" data-id="3cga7sj0m" data-path="src/components/auth/OAuthManager.tsx">
            <li data-id="ntlhyz8fk" data-path="src/components/auth/OAuthManager.tsx">
              <strong data-id="quhujypji" data-path="src/components/auth/OAuthManager.tsx">Create Google Cloud Project:</strong>
              <br data-id="05cdmmz43" data-path="src/components/auth/OAuthManager.tsx" />Go to Google Cloud Console and create a new project or select an existing one.
            </li>
            <li data-id="u5v2x42u7" data-path="src/components/auth/OAuthManager.tsx">
              <strong data-id="yq1v9gd00" data-path="src/components/auth/OAuthManager.tsx">Enable Required APIs:</strong>
              <br data-id="wyjp6235d" data-path="src/components/auth/OAuthManager.tsx" />Navigate to APIs &amp; Services &gt; Library and enable:
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1" data-id="igimvafnc" data-path="src/components/auth/OAuthManager.tsx">
                <li data-id="ttut8elni" data-path="src/components/auth/OAuthManager.tsx">BigQuery API</li>
                <li data-id="phux1bv0r" data-path="src/components/auth/OAuthManager.tsx">Cloud Storage API</li>
                <li data-id="pp7rkyxvh" data-path="src/components/auth/OAuthManager.tsx">Google+ API (for user info)</li>
              </ul>
            </li>
            <li data-id="enmfxcf5y" data-path="src/components/auth/OAuthManager.tsx">
              <strong data-id="qkckssd6t" data-path="src/components/auth/OAuthManager.tsx">Create OAuth 2.0 Client:</strong>
              <br data-id="z1fx4dwpu" data-path="src/components/auth/OAuthManager.tsx" />Navigate to APIs &amp; Services &gt; Credentials and create OAuth 2.0 client ID.
            </li>
            <li data-id="pj2a7ioks" data-path="src/components/auth/OAuthManager.tsx">
              <strong data-id="g4cejyql3" data-path="src/components/auth/OAuthManager.tsx">Configure Authorized Origins:</strong>
              <br data-id="qb8h3ix1v" data-path="src/components/auth/OAuthManager.tsx" />Add your domain (e.g., {window.location.origin}) to authorized JavaScript origins.
            </li>
            <li data-id="tq5dw078e" data-path="src/components/auth/OAuthManager.tsx">
              <strong data-id="gedbzev2t" data-path="src/components/auth/OAuthManager.tsx">Set Redirect URI:</strong>
              <br data-id="ffptv6dfp" data-path="src/components/auth/OAuthManager.tsx" />Add this redirect URI to your OAuth client: <code className="bg-gray-100 px-1 rounded" data-id="zjd9vaipx" data-path="src/components/auth/OAuthManager.tsx">{config.redirectUri}</code>
            </li>
            <li data-id="ce0tpzdiv" data-path="src/components/auth/OAuthManager.tsx">
              <strong data-id="bbk4qc6wc" data-path="src/components/auth/OAuthManager.tsx">Update Environment Variables:</strong>
              <br data-id="qpwds0xp8" data-path="src/components/auth/OAuthManager.tsx" />Add the following to your .env file:
              <div className="mt-2 bg-gray-100 p-3 rounded font-mono text-xs" data-id="svwah3kzf" data-path="src/components/auth/OAuthManager.tsx">
                VITE_GOOGLE_CLIENT_ID=your_actual_client_id.apps.googleusercontent.com<br data-id="dnghlbzkr" data-path="src/components/auth/OAuthManager.tsx" />
                VITE_GOOGLE_CLIENT_SECRET=your_actual_client_secret
              </div>
            </li>
            <li data-id="mml6pt83w" data-path="src/components/auth/OAuthManager.tsx">
              <strong data-id="56ashyc1f" data-path="src/components/auth/OAuthManager.tsx">Restart Development Server:</strong>
              <br data-id="9polhqrz4" data-path="src/components/auth/OAuthManager.tsx" />After updating .env file, restart your development server for changes to take effect.
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>);

};

export default OAuthManager;