import { AuthUser } from '@/types';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = `${window.location.origin}/auth/callback`;

class AuthService {
  private user: AuthUser | null = null;
  private tokenKey = 'google_auth_token';
  private userKey = 'google_auth_user';
  private tokenExpiryKey = 'google_auth_token_expiry';

  constructor() {
    // Load existing auth state from localStorage
    this.loadAuthState();
  }

  private loadAuthState() {
    const token = localStorage.getItem(this.tokenKey);
    const userData = localStorage.getItem(this.userKey);

    if (token && userData) {
      try {
        this.user = JSON.parse(userData);
        console.log('Loaded user from storage:', this.user);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        this.clearAuthState();
      }
    }
  }

  private saveAuthState(user: AuthUser, token: string, expiresIn?: number) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));

    // Save token expiry time (default to 1 hour if not provided)
    const expiryTime = Date.now() + (expiresIn ? expiresIn * 1000 : 3600000);
    localStorage.setItem(this.tokenExpiryKey, expiryTime.toString());

    this.user = user;
    console.log('User state saved:', user);
  }

  private clearAuthState() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenExpiryKey);
    this.user = null;
    console.log('Auth state cleared');
  }

  private isValidGoogleClientId(clientId: string): boolean {
    // Check if it's not empty and doesn't contain placeholder text
    return clientId &&
    clientId.trim() !== '' &&
    !clientId.includes('your-google-client-id') &&
    !clientId.includes('your_google_client_id') &&
    !clientId.includes('placeholder') &&
    clientId.endsWith('.apps.googleusercontent.com');
  }

  async initiateGoogleLogin(forceReauth: boolean = false): Promise<void> {
    console.log('Initiating Google OAuth login...');
    console.log('Client ID:', GOOGLE_CLIENT_ID ? `${GOOGLE_CLIENT_ID.substring(0, 20)}...` : 'Not set');

    // Validate Google Client ID
    if (!this.isValidGoogleClientId(GOOGLE_CLIENT_ID)) {
      const error = !GOOGLE_CLIENT_ID ?
      'Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file.' :
      'Google Client ID appears to be a placeholder value. Please set a valid Google Client ID in your .env file.';

      console.error('OAuth Configuration Error:', error);
      throw new Error(error);
    }

    // Create Google OAuth URL with all required scopes including storage permissions
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/bigquery',
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/devstorage.read_write',
      'https://www.googleapis.com/auth/devstorage.full_control'].
      join(' '),
      access_type: 'offline',
      prompt: forceReauth ? 'consent' : 'select_account',
      include_granted_scopes: 'true'
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    console.log('Redirecting to Google OAuth:', authUrl);

    // Redirect to Google OAuth
    window.location.href = authUrl;
  }

  async handleOAuthCallback(code: string): Promise<AuthUser> {
    console.log('Handling OAuth callback with code:', code);

    // Validate Google Client ID again
    if (!this.isValidGoogleClientId(GOOGLE_CLIENT_ID)) {
      throw new Error('Google OAuth not properly configured');
    }

    // If no client secret, we can't complete the OAuth flow
    if (!GOOGLE_CLIENT_SECRET) {
      console.error('Google Client Secret not configured');
      throw new Error('Google Client Secret is required to complete OAuth flow. Please set VITE_GOOGLE_CLIENT_SECRET in your .env file.');
    }

    try {
      console.log('Exchanging code for tokens...');

      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: REDIRECT_URI
        })
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Token exchange failed:', tokenResponse.status, errorText);
        throw new Error(`Failed to exchange code for tokens: ${tokenResponse.status}`);
      }

      const tokens = await tokenResponse.json();
      console.log('Token exchange successful');

      // Get user info from Google
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`
        }
      });

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        console.error('User info fetch failed:', userResponse.status, errorText);
        throw new Error(`Failed to get user info from Google: ${userResponse.status}`);
      }

      const googleUser = await userResponse.json();
      console.log('User info retrieved:', googleUser);

      const user: AuthUser = {
        id: googleUser.id,
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture,
        provider: 'google'
      };

      // Save with token expiry information
      this.saveAuthState(user, tokens.access_token, tokens.expires_in);
      console.log('Successfully authenticated Google user:', user);

      return user;
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw new Error('Failed to complete Google authentication');
    }
  }

  getCurrentUser(): AuthUser | null {
    return this.user;
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getTokenExpiry(): Date | null {
    const expiryTimeStr = localStorage.getItem(this.tokenExpiryKey);
    if (!expiryTimeStr) {
      return null;
    }
    return new Date(parseInt(expiryTimeStr));
  }

  async logout(): Promise<void> {
    console.log('Logging out user...');
    this.clearAuthState();

    // Redirect to home page after logout
    window.location.href = '/';
  }

  isAuthenticated(): boolean {
    const hasUser = this.user !== null;
    const hasToken = this.getAccessToken() !== null;
    const isNotExpired = !this.isTokenExpired();

    return hasUser && hasToken && isNotExpired;
  }

  willExpireSoon(): boolean {
    const expiryTimeStr = localStorage.getItem(this.tokenExpiryKey);
    if (!expiryTimeStr) {
      // If no expiry time is stored, assume it might expire soon for safety
      return true;
    }

    const expiryTime = parseInt(expiryTimeStr);
    const now = Date.now();
    const fiveMinutesFromNow = now + 5 * 60 * 1000; // 5 minutes in milliseconds

    // Return true if token expires within 5 minutes
    return expiryTime <= fiveMinutesFromNow;
  }

  private isTokenExpired(): boolean {
    const expiryTimeStr = localStorage.getItem(this.tokenExpiryKey);
    if (!expiryTimeStr) {
      // If no expiry time is stored, assume it's expired for safety
      return true;
    }

    const expiryTime = parseInt(expiryTimeStr);
    const now = Date.now();

    return now >= expiryTime;
  }

  async refreshToken(): Promise<void> {
    console.log('Token refresh not implemented for Google OAuth');
    // Implement token refresh logic if needed
    // For now, we'll just log the user out if token is expired
    if (this.isTokenExpired()) {
      await this.logout();
    }
  }

  async validateToken(): Promise<{
    valid: boolean;
    error?: string;
    scopes?: string[];
  }> {
    const token = this.getAccessToken();
    if (!token) {
      return { valid: false, error: 'No access token found' };
    }

    if (this.isTokenExpired()) {
      return { valid: false, error: 'Token has expired' };
    }

    try {
      // Validate token with Google
      const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);

      if (!response.ok) {
        return { valid: false, error: 'Token validation failed' };
      }

      const tokenInfo = await response.json();

      return {
        valid: true,
        scopes: tokenInfo.scope ? tokenInfo.scope.split(' ') : []
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown validation error'
      };
    }
  }

  async hasRequiredScopes(): Promise<boolean> {
    const validation = await this.validateToken();
    if (!validation.valid || !validation.scopes) {
      return false;
    }

    const requiredScopes = [
    'https://www.googleapis.com/auth/bigquery',
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/devstorage.read_write'];


    // Check if user has all required scopes
    // Note: cloud-platform scope includes bigquery and storage access
    return requiredScopes.every((scope) =>
    validation.scopes!.some((userScope) =>
    userScope === scope ||
    scope === 'https://www.googleapis.com/auth/bigquery' && userScope === 'https://www.googleapis.com/auth/cloud-platform' ||
    scope === 'https://www.googleapis.com/auth/devstorage.read_write' && (
    userScope === 'https://www.googleapis.com/auth/cloud-platform' ||
    userScope === 'https://www.googleapis.com/auth/devstorage.full_control')
    )
    );
  }

  async getMissingScopes(): Promise<string[]> {
    const validation = await this.validateToken();
    if (!validation.valid || !validation.scopes) {
      return [
      'https://www.googleapis.com/auth/bigquery',
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/devstorage.read_write'];

    }

    const requiredScopes = [
    'https://www.googleapis.com/auth/bigquery',
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/devstorage.read_write'];


    return requiredScopes.filter((scope) =>
    !validation.scopes!.some((userScope) =>
    userScope === scope ||
    scope === 'https://www.googleapis.com/auth/bigquery' && userScope === 'https://www.googleapis.com/auth/cloud-platform' ||
    scope === 'https://www.googleapis.com/auth/devstorage.read_write' && (
    userScope === 'https://www.googleapis.com/auth/cloud-platform' ||
    userScope === 'https://www.googleapis.com/auth/devstorage.full_control')
    )
    );
  }

  // New method: Re-authenticate with full permissions
  async reauthorizeWithFullScopes(): Promise<void> {
    console.log('🔄 Initiating re-authorization with full scopes...');

    // Clear existing token to force fresh authentication
    this.clearAuthState();

    // Initiate login with forced consent to get all scopes
    await this.initiateGoogleLogin(true);
  }

  // New method: Make authenticated requests to any API
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    if (this.isTokenExpired()) {
      throw new Error('Authentication token has expired');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    return fetch(url, {
      ...options,
      headers
    });
  }

  // New method: Test authentication by making a simple API call
  async testAuthentication(): Promise<{success: boolean;error?: string;}> {
    try {
      const response = await this.authenticatedFetch('https://www.googleapis.com/oauth2/v2/userinfo');

      if (!response.ok) {
        return {
          success: false,
          error: `Authentication test failed with status ${response.status}`
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown authentication error'
      };
    }
  }

  // New method: Clear authentication token
  clearToken(): void {
    this.clearAuthState();
  }

  // New method: Get time until token expiry in milliseconds
  getTimeUntilExpiry(): number | null {
    const expiryTimeStr = localStorage.getItem(this.tokenExpiryKey);
    if (!expiryTimeStr) {
      return null;
    }

    const expiryTime = parseInt(expiryTimeStr);
    const now = Date.now();

    return Math.max(0, expiryTime - now);
  }

  // Validation method to check if OAuth is properly configured
  validateOAuthConfiguration(): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!GOOGLE_CLIENT_ID) {
      errors.push('VITE_GOOGLE_CLIENT_ID is not set in environment variables');
    } else if (!this.isValidGoogleClientId(GOOGLE_CLIENT_ID)) {
      errors.push('VITE_GOOGLE_CLIENT_ID appears to be a placeholder value');
    }

    if (!GOOGLE_CLIENT_SECRET) {
      warnings.push('VITE_GOOGLE_CLIENT_SECRET is not set - OAuth flow cannot be completed');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Get configuration info for debugging
  getConfigurationInfo(): {
    hasClientId: boolean;
    hasClientSecret: boolean;
    clientIdValid: boolean;
    redirectUri: string;
  } {
    return {
      hasClientId: !!GOOGLE_CLIENT_ID,
      hasClientSecret: !!GOOGLE_CLIENT_SECRET,
      clientIdValid: this.isValidGoogleClientId(GOOGLE_CLIENT_ID),
      redirectUri: REDIRECT_URI
    };
  }
}

export const authService = new AuthService();
export default authService;