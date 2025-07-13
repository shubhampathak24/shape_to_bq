import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from '@/types';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
    handleOAuthCallback();
  }, []);

  const initializeAuth = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        console.log('Restored user session:', currentUser);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthCallback = async () => {
    // Check if we're on the OAuth callback route
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (window.location.pathname === '/auth/callback') {
      console.log('On OAuth callback route');
      setIsLoading(true);

      try {
        if (error) {
          console.error('OAuth error received:', error);
          throw new Error(`OAuth error: ${error}`);
        }

        if (code) {
          console.log('Processing OAuth callback with code...');
          const authenticatedUser = await authService.handleOAuthCallback(code);
          setUser(authenticatedUser);
          console.log('OAuth callback successful:', authenticatedUser);
        } else {
          console.warn('No authorization code received in callback');
        }
      } catch (error) {
        console.error('OAuth callback failed:', error);
        // Don't redirect here - let the OAuthCallback component handle the UI
      } finally {
        setIsLoading(false);
      }
    }
  };

  const login = async (): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('Starting Google OAuth login...');
      await authService.initiateGoogleLogin();

      // For demo mode, the user will be set immediately
      // For production OAuth, this will happen after OAuth callback
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        console.log('Login successful:', currentUser);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = authService.isAuthenticated() && user !== null;

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value} data-id="a3bd0gr3r" data-path="src/contexts/AuthContext.tsx">
      {children}
    </AuthContext.Provider>);

};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};