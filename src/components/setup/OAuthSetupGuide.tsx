import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  ExternalLink,
  Copy,
  CheckCircle,
  Info,
  AlertTriangle,
  Key,
  Cloud,
  Settings,
  Code } from
'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OAuthSetupGuide: React.FC = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);

    toast({
      title: "Copied to clipboard",
      description: `${label} copied successfully`
    });
  };

  const currentDomain = window.location.origin;
  const clientIdExample = "1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com";

  return (
    <div className="space-y-6" data-id="rpe2hlpmo" data-path="src/components/setup/OAuthSetupGuide.tsx">
      {/* Header */}
      <Card data-id="3ndcbll47" data-path="src/components/setup/OAuthSetupGuide.tsx">
        <CardHeader data-id="xfhxfbqun" data-path="src/components/setup/OAuthSetupGuide.tsx">
          <CardTitle className="flex items-center gap-2" data-id="993x98o42" data-path="src/components/setup/OAuthSetupGuide.tsx">
            <Key className="h-5 w-5" data-id="rr8zba793" data-path="src/components/setup/OAuthSetupGuide.tsx" />
            OAuth Setup Guide
          </CardTitle>
          <CardDescription data-id="kcecdsotp" data-path="src/components/setup/OAuthSetupGuide.tsx">
            Complete guide to configure Google OAuth for BigQuery and Cloud Storage access
          </CardDescription>
        </CardHeader>
        <CardContent data-id="j8xr9cb53" data-path="src/components/setup/OAuthSetupGuide.tsx">
          <Alert data-id="5bgf3s09j" data-path="src/components/setup/OAuthSetupGuide.tsx">
            <Info className="h-4 w-4" data-id="o6r6eoz6d" data-path="src/components/setup/OAuthSetupGuide.tsx" />
            <AlertDescription data-id="uggq73bxm" data-path="src/components/setup/OAuthSetupGuide.tsx">
              <strong data-id="kyzgyjwng" data-path="src/components/setup/OAuthSetupGuide.tsx">Why OAuth is Required:</strong> Your browser application needs OAuth to securely access 
              Google Cloud services. Service account keys cannot be used securely in browser applications.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Setup Steps */}
      <Tabs defaultValue="step1" className="space-y-4" data-id="pfvhr6iyd" data-path="src/components/setup/OAuthSetupGuide.tsx">
        <TabsList className="grid w-full grid-cols-4" data-id="3qbw00tmx" data-path="src/components/setup/OAuthSetupGuide.tsx">
          <TabsTrigger value="step1" data-id="0vpnhiivq" data-path="src/components/setup/OAuthSetupGuide.tsx">1. Project Setup</TabsTrigger>
          <TabsTrigger value="step2" data-id="dt6ifxo5t" data-path="src/components/setup/OAuthSetupGuide.tsx">2. OAuth Config</TabsTrigger>
          <TabsTrigger value="step3" data-id="1ojf6gio9" data-path="src/components/setup/OAuthSetupGuide.tsx">3. Environment</TabsTrigger>
          <TabsTrigger value="step4" data-id="tqjgdv7z2" data-path="src/components/setup/OAuthSetupGuide.tsx">4. Testing</TabsTrigger>
        </TabsList>

        {/* Step 1: Google Cloud Project Setup */}
        <TabsContent value="step1" className="space-y-4" data-id="3f5lyyg8u" data-path="src/components/setup/OAuthSetupGuide.tsx">
          <Card data-id="8ypxx5lkz" data-path="src/components/setup/OAuthSetupGuide.tsx">
            <CardHeader data-id="hb6cdxk0o" data-path="src/components/setup/OAuthSetupGuide.tsx">
              <CardTitle className="flex items-center gap-2" data-id="t87b56mkt" data-path="src/components/setup/OAuthSetupGuide.tsx">
                <Cloud className="h-5 w-5" data-id="iizdzorg7" data-path="src/components/setup/OAuthSetupGuide.tsx" />
                Step 1: Google Cloud Project Setup
              </CardTitle>
              <CardDescription data-id="adek0q3zs" data-path="src/components/setup/OAuthSetupGuide.tsx">
                Create and configure your Google Cloud project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" data-id="boyeuciw2" data-path="src/components/setup/OAuthSetupGuide.tsx">
              <div className="space-y-3" data-id="w2jh833mx" data-path="src/components/setup/OAuthSetupGuide.tsx">
                <div className="flex items-center gap-2" data-id="uo2pxzdnd" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <Badge variant="outline" data-id="2ss0qvfcb" data-path="src/components/setup/OAuthSetupGuide.tsx">1.1</Badge>
                  <span className="font-medium" data-id="5ymcam3ww" data-path="src/components/setup/OAuthSetupGuide.tsx">Create or select a Google Cloud project</span>
                </div>
                <ul className="ml-8 space-y-1 text-sm text-muted-foreground" data-id="yduyz4m43" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <li data-id="e1fo5neip" data-path="src/components/setup/OAuthSetupGuide.tsx">• Go to Google Cloud Console</li>
                  <li data-id="zsybs6b4m" data-path="src/components/setup/OAuthSetupGuide.tsx">• Create a new project or select an existing one</li>
                  <li data-id="5bnba43ec" data-path="src/components/setup/OAuthSetupGuide.tsx">• Note down your Project ID (you'll need this later)</li>
                </ul>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://console.cloud.google.com/projectselector2', '_blank')} data-id="8qkolnv1e" data-path="src/components/setup/OAuthSetupGuide.tsx">

                  <ExternalLink className="h-3 w-3 mr-1" data-id="j9xq286iy" data-path="src/components/setup/OAuthSetupGuide.tsx" />
                  Open Project Selector
                </Button>
              </div>

              <Separator data-id="oei8yjcsp" data-path="src/components/setup/OAuthSetupGuide.tsx" />

              <div className="space-y-3" data-id="sbar4g8t5" data-path="src/components/setup/OAuthSetupGuide.tsx">
                <div className="flex items-center gap-2" data-id="jfi52kjvn" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <Badge variant="outline" data-id="tw24tpctp" data-path="src/components/setup/OAuthSetupGuide.tsx">1.2</Badge>
                  <span className="font-medium" data-id="smfn4qywf" data-path="src/components/setup/OAuthSetupGuide.tsx">Enable required APIs</span>
                </div>
                <ul className="ml-8 space-y-1 text-sm text-muted-foreground" data-id="yv9ffmfr6" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <li data-id="5mxl8yo9t" data-path="src/components/setup/OAuthSetupGuide.tsx">• BigQuery API</li>
                  <li data-id="wkaf7o0za" data-path="src/components/setup/OAuthSetupGuide.tsx">• Cloud Storage API</li>
                  <li data-id="nvfrcegfs" data-path="src/components/setup/OAuthSetupGuide.tsx">• (These are required for data processing)</li>
                </ul>
                <div className="flex gap-2" data-id="k0r9wgxaj" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://console.cloud.google.com/apis/library/bigquery.googleapis.com', '_blank')} data-id="sfa15304v" data-path="src/components/setup/OAuthSetupGuide.tsx">

                    <ExternalLink className="h-3 w-3 mr-1" data-id="sskihnj12" data-path="src/components/setup/OAuthSetupGuide.tsx" />
                    Enable BigQuery API
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://console.cloud.google.com/apis/library/storage.googleapis.com', '_blank')} data-id="euzortrhe" data-path="src/components/setup/OAuthSetupGuide.tsx">

                    <ExternalLink className="h-3 w-3 mr-1" data-id="ukc7tjlko" data-path="src/components/setup/OAuthSetupGuide.tsx" />
                    Enable Storage API
                  </Button>
                </div>
              </div>

              <Separator data-id="kpei7d5ma" data-path="src/components/setup/OAuthSetupGuide.tsx" />

              <div className="space-y-3" data-id="opl8bgcx0" data-path="src/components/setup/OAuthSetupGuide.tsx">
                <div className="flex items-center gap-2" data-id="2ohi2nj78" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <Badge variant="outline" data-id="0bt70hkfx" data-path="src/components/setup/OAuthSetupGuide.tsx">1.3</Badge>
                  <span className="font-medium" data-id="nzcp4tkwg" data-path="src/components/setup/OAuthSetupGuide.tsx">Set up billing (if not already done)</span>
                </div>
                <ul className="ml-8 space-y-1 text-sm text-muted-foreground" data-id="j52h21qjg" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <li data-id="itz8jv2ey" data-path="src/components/setup/OAuthSetupGuide.tsx">• Google Cloud requires billing to use BigQuery and Cloud Storage</li>
                  <li data-id="opjvt6lu9" data-path="src/components/setup/OAuthSetupGuide.tsx">• You get $300 in free credits for new accounts</li>
                </ul>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://console.cloud.google.com/billing', '_blank')} data-id="84qtj1jji" data-path="src/components/setup/OAuthSetupGuide.tsx">

                  <ExternalLink className="h-3 w-3 mr-1" data-id="jgu7ghyms" data-path="src/components/setup/OAuthSetupGuide.tsx" />
                  Manage Billing
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 2: OAuth Configuration */}
        <TabsContent value="step2" className="space-y-4" data-id="yppx06vev" data-path="src/components/setup/OAuthSetupGuide.tsx">
          <Card data-id="brzhl7jb1" data-path="src/components/setup/OAuthSetupGuide.tsx">
            <CardHeader data-id="y3p3mmcsl" data-path="src/components/setup/OAuthSetupGuide.tsx">
              <CardTitle className="flex items-center gap-2" data-id="0gf8xm3zf" data-path="src/components/setup/OAuthSetupGuide.tsx">
                <Settings className="h-5 w-5" data-id="7bsrk1trc" data-path="src/components/setup/OAuthSetupGuide.tsx" />
                Step 2: OAuth 2.0 Configuration
              </CardTitle>
              <CardDescription data-id="fnu4n8fiu" data-path="src/components/setup/OAuthSetupGuide.tsx">
                Create OAuth credentials for your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" data-id="sqt0q1p85" data-path="src/components/setup/OAuthSetupGuide.tsx">
              <div className="space-y-3" data-id="r1q77b9iw" data-path="src/components/setup/OAuthSetupGuide.tsx">
                <div className="flex items-center gap-2" data-id="pm9fn43oa" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <Badge variant="outline" data-id="wm3sqja9c" data-path="src/components/setup/OAuthSetupGuide.tsx">2.1</Badge>
                  <span className="font-medium" data-id="jq21oll2j" data-path="src/components/setup/OAuthSetupGuide.tsx">Go to Credentials page</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')} data-id="clrvqfgkd" data-path="src/components/setup/OAuthSetupGuide.tsx">

                  <ExternalLink className="h-3 w-3 mr-1" data-id="qr8lvly3o" data-path="src/components/setup/OAuthSetupGuide.tsx" />
                  Open Credentials Page
                </Button>
              </div>

              <Separator data-id="gvty7ketf" data-path="src/components/setup/OAuthSetupGuide.tsx" />

              <div className="space-y-3" data-id="gkrlg8idp" data-path="src/components/setup/OAuthSetupGuide.tsx">
                <div className="flex items-center gap-2" data-id="osff8i3o2" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <Badge variant="outline" data-id="nvob3gwq3" data-path="src/components/setup/OAuthSetupGuide.tsx">2.2</Badge>
                  <span className="font-medium" data-id="jau56ctn0" data-path="src/components/setup/OAuthSetupGuide.tsx">Create OAuth 2.0 Client ID</span>
                </div>
                <ol className="ml-8 space-y-1 text-sm text-muted-foreground list-decimal" data-id="69ydw7e8z" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <li data-id="k1hs9ftxh" data-path="src/components/setup/OAuthSetupGuide.tsx">Click "Create Credentials" → "OAuth client ID"</li>
                  <li data-id="tykmvgxs0" data-path="src/components/setup/OAuthSetupGuide.tsx">Select "Web application" as the application type</li>
                  <li data-id="8xfjbolxh" data-path="src/components/setup/OAuthSetupGuide.tsx">Give it a name (e.g., "GIS Processing App")</li>
                  <li data-id="qtux380r6" data-path="src/components/setup/OAuthSetupGuide.tsx">Add authorized JavaScript origins</li>
                  <li data-id="1iu4nyma2" data-path="src/components/setup/OAuthSetupGuide.tsx">Add authorized redirect URIs</li>
                </ol>
              </div>

              <Separator data-id="uxvn9pwt6" data-path="src/components/setup/OAuthSetupGuide.tsx" />

              <div className="space-y-3" data-id="lffow305i" data-path="src/components/setup/OAuthSetupGuide.tsx">
                <div className="flex items-center gap-2" data-id="k7tbfc4nv" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <Badge variant="outline" data-id="bjm7z2crs" data-path="src/components/setup/OAuthSetupGuide.tsx">2.3</Badge>
                  <span className="font-medium" data-id="efnzk2id8" data-path="src/components/setup/OAuthSetupGuide.tsx">Configure authorized origins and redirects</span>
                </div>
                
                <div className="space-y-2" data-id="0ibb7ongn" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <div data-id="atxcebecn" data-path="src/components/setup/OAuthSetupGuide.tsx">
                    <p className="text-sm font-medium" data-id="x4oo3zosb" data-path="src/components/setup/OAuthSetupGuide.tsx">Authorized JavaScript origins:</p>
                    <div className="flex items-center gap-2 mt-1" data-id="5sqm15u9w" data-path="src/components/setup/OAuthSetupGuide.tsx">
                      <code className="flex-1 px-2 py-1 bg-muted text-sm rounded" data-id="v8wtjcu71" data-path="src/components/setup/OAuthSetupGuide.tsx">{currentDomain}</code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(currentDomain, 'Origin URL')} data-id="lf2idqcve" data-path="src/components/setup/OAuthSetupGuide.tsx">

                        {copiedText === 'Origin URL' ? <CheckCircle className="h-3 w-3" data-id="k5wgfeqf0" data-path="src/components/setup/OAuthSetupGuide.tsx" /> : <Copy className="h-3 w-3" data-id="b67ddslbm" data-path="src/components/setup/OAuthSetupGuide.tsx" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div data-id="3an2zmgy1" data-path="src/components/setup/OAuthSetupGuide.tsx">
                    <p className="text-sm font-medium" data-id="wxb6ca6st" data-path="src/components/setup/OAuthSetupGuide.tsx">Authorized redirect URIs:</p>
                    <div className="flex items-center gap-2 mt-1" data-id="wute67xlv" data-path="src/components/setup/OAuthSetupGuide.tsx">
                      <code className="flex-1 px-2 py-1 bg-muted text-sm rounded" data-id="0x2rjx1fj" data-path="src/components/setup/OAuthSetupGuide.tsx">{currentDomain}/oauth/callback</code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(`${currentDomain}/oauth/callback`, 'Redirect URI')} data-id="v4jy6o2re" data-path="src/components/setup/OAuthSetupGuide.tsx">

                        {copiedText === 'Redirect URI' ? <CheckCircle className="h-3 w-3" data-id="o5iup0qh9" data-path="src/components/setup/OAuthSetupGuide.tsx" /> : <Copy className="h-3 w-3" data-id="bq01oiadn" data-path="src/components/setup/OAuthSetupGuide.tsx" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <Alert data-id="7f7qcs5kq" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <Info className="h-4 w-4" data-id="5rshsnt9p" data-path="src/components/setup/OAuthSetupGuide.tsx" />
                  <AlertDescription data-id="lbmkkj2lr" data-path="src/components/setup/OAuthSetupGuide.tsx">
                    <strong data-id="93ujf9g1y" data-path="src/components/setup/OAuthSetupGuide.tsx">Important:</strong> Add both <code data-id="6bdgcsa3w" data-path="src/components/setup/OAuthSetupGuide.tsx">http://localhost:5173</code> (for development) 
                    and your production domain to the authorized origins.
                  </AlertDescription>
                </Alert>
              </div>

              <Separator data-id="xeuo56vms" data-path="src/components/setup/OAuthSetupGuide.tsx" />

              <div className="space-y-3" data-id="znjjfsdi3" data-path="src/components/setup/OAuthSetupGuide.tsx">
                <div className="flex items-center gap-2" data-id="q1htamcn3" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <Badge variant="outline" data-id="dp1oh69ph" data-path="src/components/setup/OAuthSetupGuide.tsx">2.4</Badge>
                  <span className="font-medium" data-id="mp1taqab9" data-path="src/components/setup/OAuthSetupGuide.tsx">Copy your Client ID</span>
                </div>
                <p className="ml-8 text-sm text-muted-foreground" data-id="hr691osfs" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  After creating the OAuth client, copy the Client ID. It will look like this:
                </p>
                <div className="ml-8" data-id="je76g1o71" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <code className="px-2 py-1 bg-muted text-sm rounded block" data-id="zqzku1xhd" data-path="src/components/setup/OAuthSetupGuide.tsx">
                    {clientIdExample}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 3: Environment Configuration */}
        <TabsContent value="step3" className="space-y-4" data-id="rvafocjp4" data-path="src/components/setup/OAuthSetupGuide.tsx">
          <Card data-id="zxkpet9co" data-path="src/components/setup/OAuthSetupGuide.tsx">
            <CardHeader data-id="kfq6kcvt3" data-path="src/components/setup/OAuthSetupGuide.tsx">
              <CardTitle className="flex items-center gap-2" data-id="v7bwqsye1" data-path="src/components/setup/OAuthSetupGuide.tsx">
                <Code className="h-5 w-5" data-id="46js4izvj" data-path="src/components/setup/OAuthSetupGuide.tsx" />
                Step 3: Environment Configuration
              </CardTitle>
              <CardDescription data-id="c9ozyedxp" data-path="src/components/setup/OAuthSetupGuide.tsx">
                Configure your application with the OAuth credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" data-id="vg9o6osau" data-path="src/components/setup/OAuthSetupGuide.tsx">
              <div className="space-y-3" data-id="1eyiznh35" data-path="src/components/setup/OAuthSetupGuide.tsx">
                <div className="flex items-center gap-2" data-id="k2y2f7p3v" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <Badge variant="outline" data-id="77e6wo6kk" data-path="src/components/setup/OAuthSetupGuide.tsx">3.1</Badge>
                  <span className="font-medium" data-id="mrkfene48" data-path="src/components/setup/OAuthSetupGuide.tsx">Set environment variable</span>
                </div>
                
                <p className="ml-8 text-sm text-muted-foreground" data-id="mkxqqdq6k" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  Add your Google Client ID to your environment configuration:
                </p>
                
                <div className="ml-8 space-y-2" data-id="ppof17or6" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <p className="text-sm font-medium" data-id="bwlnr1wvh" data-path="src/components/setup/OAuthSetupGuide.tsx">For development (.env.local file):</p>
                  <div className="flex items-center gap-2" data-id="5c71w6qra" data-path="src/components/setup/OAuthSetupGuide.tsx">
                    <code className="flex-1 px-2 py-1 bg-muted text-sm rounded" data-id="tyofgoox1" data-path="src/components/setup/OAuthSetupGuide.tsx">
                      VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard('VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com', 'Environment variable')} data-id="a97wucaz5" data-path="src/components/setup/OAuthSetupGuide.tsx">

                      {copiedText === 'Environment variable' ? <CheckCircle className="h-3 w-3" data-id="cphtotphh" data-path="src/components/setup/OAuthSetupGuide.tsx" /> : <Copy className="h-3 w-3" data-id="qkinb03kl" data-path="src/components/setup/OAuthSetupGuide.tsx" />}
                    </Button>
                  </div>
                </div>

                <Alert data-id="8md9n9m8s" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <AlertTriangle className="h-4 w-4" data-id="dwaenx4lo" data-path="src/components/setup/OAuthSetupGuide.tsx" />
                  <AlertDescription data-id="kv1hz7mgr" data-path="src/components/setup/OAuthSetupGuide.tsx">
                    <strong data-id="49ppo4tmh" data-path="src/components/setup/OAuthSetupGuide.tsx">Security Note:</strong> Never commit your actual Client ID to public repositories. 
                    Use environment variables and keep your .env files in .gitignore.
                  </AlertDescription>
                </Alert>
              </div>

              <Separator data-id="2ykqwr7ib" data-path="src/components/setup/OAuthSetupGuide.tsx" />

              <div className="space-y-3" data-id="sxfxntj1t" data-path="src/components/setup/OAuthSetupGuide.tsx">
                <div className="flex items-center gap-2" data-id="am5o4j757" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <Badge variant="outline" data-id="4jnhquj20" data-path="src/components/setup/OAuthSetupGuide.tsx">3.2</Badge>
                  <span className="font-medium" data-id="kfl684hbh" data-path="src/components/setup/OAuthSetupGuide.tsx">Configure project settings</span>
                </div>
                
                <p className="ml-8 text-sm text-muted-foreground" data-id="ykqeiklzr" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  Also set your GCP Project ID and other configuration:
                </p>
                
                <div className="ml-8 space-y-2" data-id="eycdx9z05" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <div className="flex items-center gap-2" data-id="d5d22usir" data-path="src/components/setup/OAuthSetupGuide.tsx">
                    <code className="flex-1 px-2 py-1 bg-muted text-sm rounded" data-id="26al376ov" data-path="src/components/setup/OAuthSetupGuide.tsx">
                      VITE_GCP_PROJECT_ID=your-gcp-project-id
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard('VITE_GCP_PROJECT_ID=your-gcp-project-id', 'Project ID variable')} data-id="fvio8cblk" data-path="src/components/setup/OAuthSetupGuide.tsx">

                      {copiedText === 'Project ID variable' ? <CheckCircle className="h-3 w-3" data-id="yt13p2zpk" data-path="src/components/setup/OAuthSetupGuide.tsx" /> : <Copy className="h-3 w-3" data-id="n92r06lb7" data-path="src/components/setup/OAuthSetupGuide.tsx" />}
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2" data-id="ajvi3eaao" data-path="src/components/setup/OAuthSetupGuide.tsx">
                    <code className="flex-1 px-2 py-1 bg-muted text-sm rounded" data-id="gk3gga772" data-path="src/components/setup/OAuthSetupGuide.tsx">
                      VITE_GCS_DEFAULT_BUCKET=your-bucket-name
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard('VITE_GCS_DEFAULT_BUCKET=your-bucket-name', 'Bucket variable')} data-id="97udrjlud" data-path="src/components/setup/OAuthSetupGuide.tsx">

                      {copiedText === 'Bucket variable' ? <CheckCircle className="h-3 w-3" data-id="vffffaxde" data-path="src/components/setup/OAuthSetupGuide.tsx" /> : <Copy className="h-3 w-3" data-id="g16m2jwqz" data-path="src/components/setup/OAuthSetupGuide.tsx" />}
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2" data-id="uh45kri06" data-path="src/components/setup/OAuthSetupGuide.tsx">
                    <code className="flex-1 px-2 py-1 bg-muted text-sm rounded" data-id="lx0pdcqkz" data-path="src/components/setup/OAuthSetupGuide.tsx">
                      VITE_ENABLE_REAL_PROCESSING=true
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard('VITE_ENABLE_REAL_PROCESSING=true', 'Processing variable')} data-id="v316g1mil" data-path="src/components/setup/OAuthSetupGuide.tsx">

                      {copiedText === 'Processing variable' ? <CheckCircle className="h-3 w-3" data-id="bjpdnwl9a" data-path="src/components/setup/OAuthSetupGuide.tsx" /> : <Copy className="h-3 w-3" data-id="u9wyfgi4m" data-path="src/components/setup/OAuthSetupGuide.tsx" />}
                    </Button>
                  </div>
                </div>
              </div>

              <Separator data-id="mibw414kv" data-path="src/components/setup/OAuthSetupGuide.tsx" />

              <div className="space-y-3" data-id="bnhrm4xt5" data-path="src/components/setup/OAuthSetupGuide.tsx">
                <div className="flex items-center gap-2" data-id="3d16p2ezl" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <Badge variant="outline" data-id="su80pf1bk" data-path="src/components/setup/OAuthSetupGuide.tsx">3.3</Badge>
                  <span className="font-medium" data-id="cj1dsr4tm" data-path="src/components/setup/OAuthSetupGuide.tsx">Restart your application</span>
                </div>
                <p className="ml-8 text-sm text-muted-foreground" data-id="8w1ud0qyc" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  After setting environment variables, restart your development server for changes to take effect.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 4: Testing */}
        <TabsContent value="step4" className="space-y-4" data-id="zqe6h6pk1" data-path="src/components/setup/OAuthSetupGuide.tsx">
          <Card data-id="y25cjaqre" data-path="src/components/setup/OAuthSetupGuide.tsx">
            <CardHeader data-id="85m1tnnzi" data-path="src/components/setup/OAuthSetupGuide.tsx">
              <CardTitle className="flex items-center gap-2" data-id="p94as2hvv" data-path="src/components/setup/OAuthSetupGuide.tsx">
                <CheckCircle className="h-5 w-5" data-id="6kalxdwwi" data-path="src/components/setup/OAuthSetupGuide.tsx" />
                Step 4: Testing Your Setup
              </CardTitle>
              <CardDescription data-id="xca4z1h91" data-path="src/components/setup/OAuthSetupGuide.tsx">
                Verify that everything is working correctly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" data-id="1b1zqnxv8" data-path="src/components/setup/OAuthSetupGuide.tsx">
              <div className="space-y-3" data-id="ocbhlir4s" data-path="src/components/setup/OAuthSetupGuide.tsx">
                <div className="flex items-center gap-2" data-id="2ztbth1uj" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <Badge variant="outline" data-id="y5s021gjp" data-path="src/components/setup/OAuthSetupGuide.tsx">4.1</Badge>
                  <span className="font-medium" data-id="4pngxu2zl" data-path="src/components/setup/OAuthSetupGuide.tsx">Test OAuth authentication</span>
                </div>
                <ul className="ml-8 space-y-1 text-sm text-muted-foreground" data-id="s4nmnee4x" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <li data-id="n2hx0tct9" data-path="src/components/setup/OAuthSetupGuide.tsx">• Click "Sign In with Google" in the OAuth Manager</li>
                  <li data-id="rs8s0mh2u" data-path="src/components/setup/OAuthSetupGuide.tsx">• Grant required permissions (BigQuery, Cloud Storage)</li>
                  <li data-id="xiew5tcq4" data-path="src/components/setup/OAuthSetupGuide.tsx">• Verify you see "Authenticated" status</li>
                </ul>
              </div>

              <Separator data-id="l03er54oh" data-path="src/components/setup/OAuthSetupGuide.tsx" />

              <div className="space-y-3" data-id="jv8loe49e" data-path="src/components/setup/OAuthSetupGuide.tsx">
                <div className="flex items-center gap-2" data-id="9wey20j2m" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <Badge variant="outline" data-id="uai9g41kj" data-path="src/components/setup/OAuthSetupGuide.tsx">4.2</Badge>
                  <span className="font-medium" data-id="l49kia028" data-path="src/components/setup/OAuthSetupGuide.tsx">Run connection diagnostics</span>
                </div>
                <ul className="ml-8 space-y-1 text-sm text-muted-foreground" data-id="ibuaglve9" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <li data-id="9ghjd8t20" data-path="src/components/setup/OAuthSetupGuide.tsx">• Go to the Diagnostics tab</li>
                  <li data-id="yih5sylgx" data-path="src/components/setup/OAuthSetupGuide.tsx">• Click "Run Connection Tests"</li>
                  <li data-id="imm4amyao" data-path="src/components/setup/OAuthSetupGuide.tsx">• Verify all tests pass</li>
                </ul>
              </div>

              <Separator data-id="15zo2nswr" data-path="src/components/setup/OAuthSetupGuide.tsx" />

              <div className="space-y-3" data-id="91w6bswjq" data-path="src/components/setup/OAuthSetupGuide.tsx">
                <div className="flex items-center gap-2" data-id="fp38u7mly" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <Badge variant="outline" data-id="eeztvy1pc" data-path="src/components/setup/OAuthSetupGuide.tsx">4.3</Badge>
                  <span className="font-medium" data-id="v4prcio4o" data-path="src/components/setup/OAuthSetupGuide.tsx">Test file processing</span>
                </div>
                <ul className="ml-8 space-y-1 text-sm text-muted-foreground" data-id="8edui5ulz" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <li data-id="4yeeiz4iq" data-path="src/components/setup/OAuthSetupGuide.tsx">• Upload a small shapefile in the Process tab</li>
                  <li data-id="p613axa3y" data-path="src/components/setup/OAuthSetupGuide.tsx">• Configure your project ID and target table</li>
                  <li data-id="iydjv7odi" data-path="src/components/setup/OAuthSetupGuide.tsx">• Start processing and monitor the job status</li>
                </ul>
              </div>

              <Alert data-id="jsayjfiuz" data-path="src/components/setup/OAuthSetupGuide.tsx">
                <CheckCircle className="h-4 w-4" data-id="vxduo59z1" data-path="src/components/setup/OAuthSetupGuide.tsx" />
                <AlertDescription data-id="9b4falcfm" data-path="src/components/setup/OAuthSetupGuide.tsx">
                  <strong data-id="kp79pzmid" data-path="src/components/setup/OAuthSetupGuide.tsx">Success!</strong> If all tests pass, your application is ready to process GIS data 
                  and load it into BigQuery using OAuth authentication.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Troubleshooting */}
      <Card data-id="17ottyvw9" data-path="src/components/setup/OAuthSetupGuide.tsx">
        <CardHeader data-id="i6or72kmo" data-path="src/components/setup/OAuthSetupGuide.tsx">
          <CardTitle className="flex items-center gap-2" data-id="n8v6b07ff" data-path="src/components/setup/OAuthSetupGuide.tsx">
            <AlertTriangle className="h-5 w-5" data-id="1wcjc7gsx" data-path="src/components/setup/OAuthSetupGuide.tsx" />
            Common Issues & Troubleshooting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3" data-id="hyrek2885" data-path="src/components/setup/OAuthSetupGuide.tsx">
          <div className="space-y-2" data-id="1hkplum4y" data-path="src/components/setup/OAuthSetupGuide.tsx">
            <p className="font-medium text-sm" data-id="mesqpb0qd" data-path="src/components/setup/OAuthSetupGuide.tsx">Error: "Invalid client" or "Origin not allowed"</p>
            <p className="text-sm text-muted-foreground ml-4" data-id="16e5afztl" data-path="src/components/setup/OAuthSetupGuide.tsx">
              • Check that your domain is added to authorized JavaScript origins<br data-id="gn8avzgyk" data-path="src/components/setup/OAuthSetupGuide.tsx" />
              • Ensure the Client ID is correctly set in environment variables
            </p>
          </div>
          
          <Separator data-id="arvg7e8eb" data-path="src/components/setup/OAuthSetupGuide.tsx" />
          
          <div className="space-y-2" data-id="36xlfovhr" data-path="src/components/setup/OAuthSetupGuide.tsx">
            <p className="font-medium text-sm" data-id="9j22odt5j" data-path="src/components/setup/OAuthSetupGuide.tsx">Error: "Access denied" or "Insufficient permissions"</p>
            <p className="text-sm text-muted-foreground ml-4" data-id="r6f4i0dc7" data-path="src/components/setup/OAuthSetupGuide.tsx">
              • Make sure BigQuery and Cloud Storage APIs are enabled<br data-id="ppxmayz23" data-path="src/components/setup/OAuthSetupGuide.tsx" />
              • Verify you have the necessary permissions in your GCP project<br data-id="ulhwfbyrx" data-path="src/components/setup/OAuthSetupGuide.tsx" />
              • Grant all requested scopes during OAuth consent
            </p>
          </div>
          
          <Separator data-id="rjj8w0fn1" data-path="src/components/setup/OAuthSetupGuide.tsx" />
          
          <div className="space-y-2" data-id="w7co99f60" data-path="src/components/setup/OAuthSetupGuide.tsx">
            <p className="font-medium text-sm" data-id="u2vnv61vl" data-path="src/components/setup/OAuthSetupGuide.tsx">Error: "Project not found" or "Billing not enabled"</p>
            <p className="text-sm text-muted-foreground ml-4" data-id="qyyie0zye" data-path="src/components/setup/OAuthSetupGuide.tsx">
              • Verify your GCP Project ID is correct<br data-id="g5b34tj38" data-path="src/components/setup/OAuthSetupGuide.tsx" />
              • Ensure billing is enabled for your project<br data-id="r2mo964fv" data-path="src/components/setup/OAuthSetupGuide.tsx" />
              • Check that you have access to the project
            </p>
          </div>
        </CardContent>
      </Card>
    </div>);

};

export default OAuthSetupGuide;