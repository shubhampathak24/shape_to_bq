import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import HomePage from '@/pages/HomePage';
import NotFound from '@/pages/NotFound';
import OAuthCallback from '@/components/auth/OAuthCallback';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient} data-id="cwnjfq9hb" data-path="src/App.tsx">
      <TooltipProvider data-id="uvdf7fmzw" data-path="src/App.tsx">
        <AuthProvider data-id="2dzzmd5o3" data-path="src/App.tsx">
          <Router data-id="8t657jhkm" data-path="src/App.tsx">
            <div className="App min-h-screen" data-id="qzw5yho3l" data-path="src/App.tsx">
              <Routes data-id="w6rkvpign" data-path="src/App.tsx">
                <Route path="/" element={<HomePage data-id="9cy2w3bk8" data-path="src/App.tsx" />} data-id="ga0m89vko" data-path="src/App.tsx" />
                <Route path="/auth/callback" element={<OAuthCallback data-id="b39d40a4m" data-path="src/App.tsx" />} data-id="jxfkfsxv7" data-path="src/App.tsx" />
                <Route path="*" element={<NotFound data-id="7sjb31hix" data-path="src/App.tsx" />} data-id="f9edt68c0" data-path="src/App.tsx" />
              </Routes>
              <Toaster data-id="6bdsv5zqr" data-path="src/App.tsx" />
            </div>
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>);

}

export default App;