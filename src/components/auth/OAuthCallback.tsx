import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading } = useAuth();
  const [status, setStatus] = React.useState<'processing' | 'success' | 'error' | 'demo'>('processing');
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      console.log('OAuth callback - URL params:', { code: !!code, error, errorDescription });

      // Check if Google OAuth is properly configured
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const isGoogleConfigured = googleClientId &&
      googleClientId !== 'your-google-client-id.apps.googleusercontent.com' &&
      googleClientId !== 'your_google_client_id_here';

      if (!isGoogleConfigured) {
        console.log('Google OAuth not configured, using demo mode');
        setStatus('demo');
        toast({
          title: 'Demo Mode',
          description: 'Google OAuth is not configured. Using demo authentication.'
        });

        // Simulate demo user login
        setTimeout(() => {
          setStatus('success');
          toast({
            title: 'Demo Authentication Successful',
            description: 'You are now signed in with demo credentials.'
          });
          setTimeout(() => navigate('/'), 1500);
        }, 2000);
        return;
      }

      if (error) {
        console.error('OAuth error:', error, errorDescription);
        setStatus('error');
        setErrorMessage(errorDescription || error);
        toast({
          title: 'Authentication Failed',
          description: errorDescription || 'OAuth authentication was cancelled or failed.',
          variant: 'destructive'
        });
        return;
      }

      if (!code) {
        console.error('No authorization code received');
        setStatus('error');
        setErrorMessage('No authorization code was received from Google.');
        toast({
          title: 'Authentication Failed',
          description: 'No authorization code was received.',
          variant: 'destructive'
        });
        return;
      }

      // The actual OAuth handling is done in AuthContext
      // We just need to wait for it to complete and show appropriate status
      console.log('OAuth callback component loaded with code:', code);

      // Wait a moment for AuthContext to process the callback
      setTimeout(() => {
        const user = localStorage.getItem('google_auth_user');
        if (user) {
          setStatus('success');
          toast({
            title: 'Authentication Successful',
            description: 'You have been successfully logged in.'
          });
          // Redirect after showing success message
          setTimeout(() => navigate('/'), 1500);
        } else {
          setStatus('error');
          setErrorMessage('Failed to complete authentication');
          toast({
            title: 'Authentication Failed',
            description: 'Failed to complete the authentication process.',
            variant: 'destructive'
          });
        }
      }, 2000);
    };

    handleCallback();
  }, [navigate, toast]);

  const handleRetry = () => {
    navigate('/');
  };

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center space-y-4" data-id="q7ixr0mhh" data-path="src/components/auth/OAuthCallback.tsx">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" data-id="t85g741v8" data-path="src/components/auth/OAuthCallback.tsx" />
            <div data-id="0quwy57zs" data-path="src/components/auth/OAuthCallback.tsx">
              <h2 className="text-xl font-semibold" data-id="n96p0xhgf" data-path="src/components/auth/OAuthCallback.tsx">Completing Sign In</h2>
              <p className="text-gray-600 mt-2" data-id="x92ouvqas" data-path="src/components/auth/OAuthCallback.tsx">
                Please wait while we finish setting up your account...
              </p>
            </div>
          </div>);


      case 'demo':
        return (
          <div className="text-center space-y-4" data-id="54u7vcem3" data-path="src/components/auth/OAuthCallback.tsx">
            <Info className="h-8 w-8 mx-auto text-blue-600" data-id="mqyhkqyqw" data-path="src/components/auth/OAuthCallback.tsx" />
            <div data-id="6gnt0p50t" data-path="src/components/auth/OAuthCallback.tsx">
              <h2 className="text-xl font-semibold text-blue-700" data-id="v9w5tbs5i" data-path="src/components/auth/OAuthCallback.tsx">Demo Mode</h2>
              <p className="text-gray-600 mt-2" data-id="xrsacni81" data-path="src/components/auth/OAuthCallback.tsx">
                Google OAuth is not configured. Using demo authentication...
              </p>
            </div>
            <Alert data-id="b780a0igz" data-path="src/components/auth/OAuthCallback.tsx">
              <Info className="h-4 w-4" data-id="pmym4k8ob" data-path="src/components/auth/OAuthCallback.tsx" />
              <AlertDescription data-id="qn7dy8k8t" data-path="src/components/auth/OAuthCallback.tsx">
                To use real Google authentication, configure your Google Client ID in the environment variables.
              </AlertDescription>
            </Alert>
          </div>);


      case 'success':
        return (
          <div className="text-center space-y-4" data-id="ixer5a9a0" data-path="src/components/auth/OAuthCallback.tsx">
            <CheckCircle className="h-8 w-8 mx-auto text-green-600" data-id="bo733fvgp" data-path="src/components/auth/OAuthCallback.tsx" />
            <div data-id="vgg2xqxkv" data-path="src/components/auth/OAuthCallback.tsx">
              <h2 className="text-xl font-semibold text-green-700" data-id="1ea6lqx1c" data-path="src/components/auth/OAuthCallback.tsx">Success!</h2>
              <p className="text-gray-600 mt-2" data-id="rmcq378my" data-path="src/components/auth/OAuthCallback.tsx">
                You have been successfully signed in. Redirecting...
              </p>
            </div>
          </div>);


      case 'error':
        return (
          <div className="text-center space-y-4" data-id="o5q5dt7jw" data-path="src/components/auth/OAuthCallback.tsx">
            <XCircle className="h-8 w-8 mx-auto text-red-600" data-id="jret2fkf0" data-path="src/components/auth/OAuthCallback.tsx" />
            <div data-id="64yk6yyyy" data-path="src/components/auth/OAuthCallback.tsx">
              <h2 className="text-xl font-semibold text-red-700" data-id="xv2hm784t" data-path="src/components/auth/OAuthCallback.tsx">Authentication Failed</h2>
              <p className="text-gray-600 mt-2" data-id="za8g5wxj8" data-path="src/components/auth/OAuthCallback.tsx">
                There was an issue completing your sign in.
              </p>
            </div>
            {errorMessage &&
            <Alert variant="destructive" data-id="zop8z6e3k" data-path="src/components/auth/OAuthCallback.tsx">
                <AlertDescription data-id="0r6ct7l9a" data-path="src/components/auth/OAuthCallback.tsx">{errorMessage}</AlertDescription>
              </Alert>
            }
            <Button onClick={handleRetry} className="mt-4" data-id="f2zl0m7cf" data-path="src/components/auth/OAuthCallback.tsx">
              Return to Sign In
            </Button>
          </div>);


      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4" data-id="g43drfodx" data-path="src/components/auth/OAuthCallback.tsx">
      <Card className="w-full max-w-md" data-id="7naz23dkc" data-path="src/components/auth/OAuthCallback.tsx">
        <CardContent className="p-8" data-id="m2dzjro0m" data-path="src/components/auth/OAuthCallback.tsx">
          {renderContent()}
        </CardContent>
      </Card>
    </div>);

};

export default OAuthCallback;