import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  CheckCircle,
  Copy,
  ExternalLink,
  Shield,
  User,
  Settings,
  Cloud,
  FileText,
  Info } from
'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GCSPermissionGuideProps {
  error?: string;
  userEmail?: string;
  projectId?: string;
}

const GCSPermissionGuide: React.FC<GCSPermissionGuideProps> = ({
  error,
  userEmail,
  projectId
}) => {
  const { toast } = useToast();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(label);
      toast({
        title: "Copied to clipboard",
        description: `${label} has been copied to your clipboard.`
      });
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the text manually.",
        variant: "destructive"
      });
    }
  };

  const requiredRoles = [
  {
    role: 'Storage Object Viewer',
    id: 'roles/storage.objectViewer',
    description: 'Allows reading objects in Cloud Storage buckets'
  },
  {
    role: 'Storage Object Creator',
    id: 'roles/storage.objectCreator',
    description: 'Allows creating objects in Cloud Storage buckets'
  },
  {
    role: 'Storage Legacy Bucket Reader',
    id: 'roles/storage.legacyBucketReader',
    description: 'Allows listing buckets and reading bucket metadata'
  }];


  const alternativeRoles = [
  {
    role: 'Storage Admin',
    id: 'roles/storage.admin',
    description: 'Full control over Cloud Storage (includes all permissions above)'
  },
  {
    role: 'Storage Object Admin',
    id: 'roles/storage.objectAdmin',
    description: 'Full control over objects in Cloud Storage'
  }];


  return (
    <div className="space-y-6" data-id="xoxk1tkc5" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
      {/* Error Summary */}
      {error &&
      <Alert className="border-red-200 bg-red-50" data-id="1b2h14zrk" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
          <AlertCircle className="h-4 w-4 text-red-600" data-id="za30c7qqz" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx" />
          <AlertDescription className="text-red-800" data-id="qlhzv6jqv" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
            <strong data-id="ymzub2o5b" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">Permission Error:</strong> {error}
          </AlertDescription>
        </Alert>
      }

      {/* Quick Info */}
      <Card data-id="i1xx749j1" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
        <CardHeader data-id="j1te9kt50" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
          <CardTitle className="flex items-center gap-2" data-id="vc7tx1d76" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
            <Info className="h-5 w-5 text-blue-600" data-id="ouxn4t264" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx" />
            Quick Summary
          </CardTitle>
          <CardDescription data-id="fp6h52jze" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
            You need proper Google Cloud Storage permissions to use this application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4" data-id="jrfy02es8" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
          {userEmail &&
          <div className="flex items-center gap-2" data-id="5ayswa1w2" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
              <User className="h-4 w-4 text-gray-500" data-id="pij32ai7n" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx" />
              <span className="text-sm text-gray-600" data-id="7m75qg3po" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">Current user:</span>
              <Badge variant="outline" data-id="kobiba3zj" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">{userEmail}</Badge>
            </div>
          }
          {projectId &&
          <div className="flex items-center gap-2" data-id="kr5rdcfht" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
              <Cloud className="h-4 w-4 text-gray-500" data-id="hqblr3jpl" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx" />
              <span className="text-sm text-gray-600" data-id="or9i9btac" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">Project ID:</span>
              <Badge variant="outline" data-id="p6sozlbzg" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">{projectId}</Badge>
            </div>
          }
        </CardContent>
      </Card>

      {/* Step-by-step Solution */}
      <Tabs defaultValue="permissions" className="w-full" data-id="zq7eoisgj" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
        <TabsList className="grid w-full grid-cols-3" data-id="ury78nvai" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
          <TabsTrigger value="permissions" data-id="p8o6r00ih" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">Fix Permissions</TabsTrigger>
          <TabsTrigger value="oauth" data-id="eznq1cgd6" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">Re-authenticate</TabsTrigger>
          <TabsTrigger value="troubleshoot" data-id="fewj24wd2" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">Troubleshoot</TabsTrigger>
        </TabsList>

        {/* Fix Permissions Tab */}
        <TabsContent value="permissions" className="space-y-4" data-id="atv04n8c2" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
          <Card data-id="wvxk57ctm" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
            <CardHeader data-id="6hjkop6yh" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
              <CardTitle className="flex items-center gap-2" data-id="4flbne30m" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                <Shield className="h-5 w-5 text-green-600" data-id="kjfeyyirt" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx" />
                Grant Required Permissions
              </CardTitle>
              <CardDescription data-id="v8em8p1m7" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                A Google Cloud project administrator needs to grant you the following permissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6" data-id="fly5fz18c" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
              {/* Required Roles */}
              <div data-id="w14nfcmr3" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                <h4 className="font-medium mb-3 flex items-center gap-2" data-id="af5ixej0z" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                  <CheckCircle className="h-4 w-4 text-green-600" data-id="n0n2gevq7" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx" />
                  Required IAM Roles
                </h4>
                <div className="space-y-3" data-id="ccaedmhf8" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                  {requiredRoles.map((role, index) =>
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg" data-id="tqoq30md9" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                      <div className="flex-1" data-id="je0qiypgw" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                        <div className="font-mono text-sm font-medium" data-id="61bwkdwgl" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">{role.role}</div>
                        <div className="text-xs text-gray-500 mt-1" data-id="socdad3ty" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">{role.description}</div>
                        <div className="text-xs text-gray-400 font-mono mt-1" data-id="ndu26u2ga" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">{role.id}</div>
                      </div>
                      <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(role.id, role.role)}
                      className="ml-2" data-id="bpt0m52wj" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">

                        {copiedItem === role.role ?
                      <>
                            <CheckCircle className="h-3 w-3 mr-1" data-id="dh4b8vuua" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx" />
                            Copied
                          </> :

                      <>
                            <Copy className="h-3 w-3 mr-1" data-id="b022zbk6g" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx" />
                            Copy
                          </>
                      }
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <Separator data-id="13xne2n9i" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx" />

              {/* Alternative Roles */}
              <div data-id="4z6dsid14" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                <h4 className="font-medium mb-3 flex items-center gap-2" data-id="4321799ki" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                  <Settings className="h-4 w-4 text-blue-600" data-id="2qfkpta1e" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx" />
                  Alternative (Broader) Roles
                </h4>
                <div className="space-y-3" data-id="wlvxvxcs8" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                  {alternativeRoles.map((role, index) =>
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50" data-id="mydxtlhvx" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                      <div className="flex-1" data-id="yj90msfdc" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                        <div className="font-mono text-sm font-medium" data-id="08q2mc5wd" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">{role.role}</div>
                        <div className="text-xs text-gray-600 mt-1" data-id="v3t5w1w4k" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">{role.description}</div>
                        <div className="text-xs text-gray-500 font-mono mt-1" data-id="ngm9aqdir" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">{role.id}</div>
                      </div>
                      <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(role.id, role.role)}
                      className="ml-2" data-id="pzw8s00ef" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">

                        {copiedItem === role.role ?
                      <>
                            <CheckCircle className="h-3 w-3 mr-1" data-id="3dtjvggug" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx" />
                            Copied
                          </> :

                      <>
                            <Copy className="h-3 w-3 mr-1" data-id="s7o7bgytp" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx" />
                            Copy
                          </>
                      }
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <Separator data-id="ago6igfgo" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx" />

              {/* Instructions */}
              <div data-id="xqpl28x3h" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                <h4 className="font-medium mb-3 flex items-center gap-2" data-id="r9xlzybia" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                  <FileText className="h-4 w-4 text-purple-600" data-id="gi3gofjvs" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx" />
                  Step-by-Step Instructions
                </h4>
                <ol className="space-y-2 text-sm" data-id="0hpbmd2bs" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                  <li className="flex gap-3" data-id="j8398wbwz" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium" data-id="bnwjr74vm" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">1</span>
                    <span data-id="1rg0i8z88" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">Go to the <a href="https://console.cloud.google.com/iam-admin/iam" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" data-id="j8i1m6y4q" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">Google Cloud Console IAM page</a></span>
                  </li>
                  <li className="flex gap-3" data-id="k6ek7qg0c" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium" data-id="3rcrh2mmy" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">2</span>
                    <span data-id="42ch0xmk3" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">Select your project from the dropdown</span>
                  </li>
                  <li className="flex gap-3" data-id="iu12lje8c" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium" data-id="zuv56bc11" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">3</span>
                    <span data-id="cz6rbyqat" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">Click "Add" or "Grant Access"</span>
                  </li>
                  <li className="flex gap-3" data-id="n7j8xibl0" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium" data-id="jhzbzvvlz" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">4</span>
                    <span data-id="krya907b1" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">Enter the user email: <code className="bg-gray-100 px-1 rounded text-xs" data-id="ocjj0a24k" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">{userEmail || 'your-email@example.com'}</code></span>
                  </li>
                  <li className="flex gap-3" data-id="rrhms26h5" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium" data-id="npsrru5i3" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">5</span>
                    <span data-id="mlhcg77tb" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">Add the required roles listed above</span>
                  </li>
                  <li className="flex gap-3" data-id="28pbn0e78" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium" data-id="acvx4syei" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">6</span>
                    <span data-id="nqbwzi8mk" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">Click "Save" to apply the permissions</span>
                  </li>
                </ol>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open('https://console.cloud.google.com/iam-admin/iam', '_blank')} data-id="riwp2df6t" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">

                <ExternalLink className="h-4 w-4 mr-2" data-id="hy999o9g0" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx" />
                Open Google Cloud Console IAM
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Re-authenticate Tab */}
        <TabsContent value="oauth" className="space-y-4" data-id="eg54h718l" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
          <Card data-id="9i9uzcxtq" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
            <CardHeader data-id="sd0bf7eih" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
              <CardTitle className="flex items-center gap-2" data-id="wnbxw4i83" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                <User className="h-5 w-5 text-orange-600" data-id="y7ltfrwaj" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx" />
                Re-authenticate with Full Permissions
              </CardTitle>
              <CardDescription data-id="rbemfxeow" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                After permissions are granted, re-authenticate to get the updated access.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" data-id="x65upn8h6" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
              <Alert data-id="9oyrdm8pa" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                <Info className="h-4 w-4" data-id="0y8ks2hfb" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx" />
                <AlertDescription data-id="oumvax2zz" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                  Even after permissions are granted, you may need to re-authenticate to ensure your session has the updated permissions.
                </AlertDescription>
              </Alert>

              <div className="space-y-3" data-id="6fuyu6ghj" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                <div className="text-sm" data-id="8zyb23h6n" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                  <strong data-id="67zi1zt1z" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">What this does:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600" data-id="7861pxpjg" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                    <li data-id="x40xt4nb2" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">Clears your current authentication session</li>
                    <li data-id="4nrc7ok5i" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">Requests fresh permissions from Google</li>
                    <li data-id="li1bw9qft" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">Updates your access token with the latest permissions</li>
                  </ul>
                </div>

                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => {
                    // This will trigger re-authentication
                    window.location.href = '/';
                    localStorage.clear();
                  }} data-id="130szllrx" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">

                  Sign Out and Re-authenticate
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Troubleshoot Tab */}
        <TabsContent value="troubleshoot" className="space-y-4" data-id="dt488yapj" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
          <Card data-id="nhdn2exeo" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
            <CardHeader data-id="5pyd8fu69" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
              <CardTitle className="flex items-center gap-2" data-id="jdjkfaz6v" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                <AlertCircle className="h-5 w-5 text-red-600" data-id="iq8ks4w7w" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx" />
                Common Issues & Solutions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4" data-id="liwf0ehof" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
              <div className="space-y-4" data-id="i06z7e5ob" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                <div className="border rounded-lg p-4" data-id="rw045k5kp" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                  <h4 className="font-medium text-red-700 mb-2" data-id="7qks3cacm" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">Error: Permission 'storage.buckets.list' denied</h4>
                  <p className="text-sm text-gray-600 mb-2" data-id="b9bezmfvw" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                    This means your account doesn't have permission to list buckets in the project.
                  </p>
                  <p className="text-sm font-medium text-blue-600" data-id="yx52q15l4" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                    Solution: Add the "Storage Legacy Bucket Reader" role or "Storage Admin" role.
                  </p>
                </div>

                <div className="border rounded-lg p-4" data-id="mb8cy7ihg" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                  <h4 className="font-medium text-red-700 mb-2" data-id="jvplyjszs" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">Error: Permission 'storage.objects.list' denied</h4>
                  <p className="text-sm text-gray-600 mb-2" data-id="7ant5xikl" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                    This means your account can't list objects in the bucket.
                  </p>
                  <p className="text-sm font-medium text-blue-600" data-id="p7a0szofv" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                    Solution: Add the "Storage Object Viewer" role or "Storage Object Admin" role.
                  </p>
                </div>

                <div className="border rounded-lg p-4" data-id="za01ox8b1" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                  <h4 className="font-medium text-red-700 mb-2" data-id="42wyf07sa" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">Error: Permission 'storage.objects.create' denied</h4>
                  <p className="text-sm text-gray-600 mb-2" data-id="l0n7aqox1" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                    This means your account can't upload files to the bucket.
                  </p>
                  <p className="text-sm font-medium text-blue-600" data-id="p7t1ta5xu" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                    Solution: Add the "Storage Object Creator" role or "Storage Object Admin" role.
                  </p>
                </div>

                <div className="border rounded-lg p-4" data-id="pjt4trbq0" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                  <h4 className="font-medium text-red-700 mb-2" data-id="yv22cabac" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">Still having issues?</h4>
                  <ul className="text-sm text-gray-600 space-y-1" data-id="aixd3eomg" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">
                    <li data-id="n9n70zk43" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">• Make sure you're using the correct Google Cloud project</li>
                    <li data-id="8rloosymd" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">• Verify the project ID is correct in your configuration</li>
                    <li data-id="6mpbnrnzu" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">• Wait a few minutes after permissions are granted (changes can take time to propagate)</li>
                    <li data-id="26zi2wbav" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">• Try signing out and signing back in</li>
                    <li data-id="lem8dlk1u" data-path="src/components/troubleshooting/GCSPermissionGuide.tsx">• Contact your Google Cloud project administrator</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);

};

export default GCSPermissionGuide;