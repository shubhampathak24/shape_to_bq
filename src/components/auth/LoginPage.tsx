import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Chrome, Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      console.log('Initiating Google OAuth login...');
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50" data-id="6hz490s3b" data-path="src/components/auth/LoginPage.tsx">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto p-8 gap-12" data-id="2zccbow7s" data-path="src/components/auth/LoginPage.tsx">
        {/* Left side - Hero Section */}
        <div className="flex-1 text-center md:text-left space-y-8" data-id="c96f7wjrk" data-path="src/components/auth/LoginPage.tsx">
          {/* Logo */}
          <div className="flex items-center justify-center md:justify-start space-x-3" data-id="sh6gccd35" data-path="src/components/auth/LoginPage.tsx">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center" data-id="zn2n6hz4c" data-path="src/components/auth/LoginPage.tsx">
              <MapPin className="w-8 h-8 text-white" data-id="zuiocf77a" data-path="src/components/auth/LoginPage.tsx" />
            </div>
            <div data-id="kmtaaz95w" data-path="src/components/auth/LoginPage.tsx">
              <h1 className="text-3xl font-bold text-gray-900" data-id="hmeocf41t" data-path="src/components/auth/LoginPage.tsx">GeoData Loader</h1>
              <p className="text-gray-600" data-id="xw849g2tz" data-path="src/components/auth/LoginPage.tsx">Seamlessly upload and process geospatial data to BigQuery</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6" data-id="ox1ao5lns" data-path="src/components/auth/LoginPage.tsx">
            <h2 className="text-2xl font-bold text-gray-900" data-id="gcifhgwux" data-path="src/components/auth/LoginPage.tsx">Powerful Features</h2>
            
            <div className="space-y-4" data-id="mi6fxuxcg" data-path="src/components/auth/LoginPage.tsx">
              <div className="flex items-start space-x-4" data-id="c2xo23zvw" data-path="src/components/auth/LoginPage.tsx">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0" data-id="5ucffu0gf" data-path="src/components/auth/LoginPage.tsx">
                  <Chrome className="w-4 h-4 text-blue-600" data-id="oykimijh6" data-path="src/components/auth/LoginPage.tsx" />
                </div>
                <div data-id="5u0bpqhal" data-path="src/components/auth/LoginPage.tsx">
                  <h3 className="font-semibold text-gray-900" data-id="o6rcgd9y4" data-path="src/components/auth/LoginPage.tsx">Easy Upload</h3>
                  <p className="text-gray-600 text-sm" data-id="xrepot5w8" data-path="src/components/auth/LoginPage.tsx">Upload shapefiles directly or specify Google Cloud Storage paths</p>
                </div>
              </div>

              <div className="flex items-start space-x-4" data-id="sfkg3g2xy" data-path="src/components/auth/LoginPage.tsx">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0" data-id="zqoscboms" data-path="src/components/auth/LoginPage.tsx">
                  <Chrome className="w-4 h-4 text-purple-600" data-id="6hhdb3ngj" data-path="src/components/auth/LoginPage.tsx" />
                </div>
                <div data-id="xk1avb5fk" data-path="src/components/auth/LoginPage.tsx">
                  <h3 className="font-semibold text-gray-900" data-id="j6jtnk6j2" data-path="src/components/auth/LoginPage.tsx">BigQuery Integration</h3>
                  <p className="text-gray-600 text-sm" data-id="h9ky7ezgu" data-path="src/components/auth/LoginPage.tsx">Seamlessly load processed data into Google BigQuery tables</p>
                </div>
              </div>

              <div className="flex items-start space-x-4" data-id="1ko8u3sc1" data-path="src/components/auth/LoginPage.tsx">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0" data-id="7hxn837mg" data-path="src/components/auth/LoginPage.tsx">
                  <MapPin className="w-4 h-4 text-green-600" data-id="h3whqkxi8" data-path="src/components/auth/LoginPage.tsx" />
                </div>
                <div data-id="2zrnebf86" data-path="src/components/auth/LoginPage.tsx">
                  <h3 className="font-semibold text-gray-900" data-id="sqd2olwsn" data-path="src/components/auth/LoginPage.tsx">Real-time Tracking</h3>
                  <p className="text-gray-600 text-sm" data-id="03v6mdjst" data-path="src/components/auth/LoginPage.tsx">Monitor processing status and view detailed logs in real-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Card */}
        <div className="flex-1 max-w-md w-full" data-id="1hxt76awl" data-path="src/components/auth/LoginPage.tsx">
          <Card className="shadow-xl border-0" data-id="zpwo8l6yx" data-path="src/components/auth/LoginPage.tsx">
            <CardHeader className="text-center space-y-4" data-id="9xv3fsmlu" data-path="src/components/auth/LoginPage.tsx">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center" data-id="3m788s8s4" data-path="src/components/auth/LoginPage.tsx">
                <Chrome className="w-6 h-6 text-white" data-id="8mwzjvjdg" data-path="src/components/auth/LoginPage.tsx" />
              </div>
              <div data-id="dtutl2xlx" data-path="src/components/auth/LoginPage.tsx">
                <CardTitle className="text-2xl font-bold text-gray-900" data-id="vpuvmus57" data-path="src/components/auth/LoginPage.tsx">Welcome Back</CardTitle>
                <CardDescription className="text-gray-600" data-id="95cck8p1m" data-path="src/components/auth/LoginPage.tsx">
                  Sign in to start processing your geospatial data
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6" data-id="ndzmyrusp" data-path="src/components/auth/LoginPage.tsx">
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white h-12 text-lg font-medium"
                size="lg" data-id="23mhxbp61" data-path="src/components/auth/LoginPage.tsx">
                {isLoading ?
                <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" data-id="he5s8paci" data-path="src/components/auth/LoginPage.tsx" />
                    Signing in...
                  </> :

                <>
                    <Chrome className="w-5 h-5 mr-3" data-id="h5iygrzbq" data-path="src/components/auth/LoginPage.tsx" />
                    Sign in with Google
                  </>
                }
              </Button>
              
              <div className="text-center text-sm text-gray-500" data-id="728tvih33" data-path="src/components/auth/LoginPage.tsx">
                <p data-id="ejak5b8yi" data-path="src/components/auth/LoginPage.tsx">Secure authentication powered by Google</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);

};

export default LoginPage;