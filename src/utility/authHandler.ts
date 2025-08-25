import Cookies from 'js-cookie';
import { store } from '../store/store';
import { setAuthTokens, setAuthShareToken } from '../store/slice/LoginSlice';

export interface UserInfo {
  userId?: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

export interface ProfileInfo {
  profileId?: string;
  profileName?: string;
  [key: string]: unknown;
}

export interface SelectedProfile {
  ProfileId: string;
  ProfileName: string;
  [key: string]: unknown;
}

export interface AuthData {
  accessToken: string;
  consumerKey: string;
  consumerSecret: string;
  tokenExpiry: string;
  profileId: string;
  userId: string;
  refreshToken?: string;
  refreshTokenExpiry?: string;
  userInfo?: UserInfo;
  profileInfo?: ProfileInfo;
  selectedProfile?: SelectedProfile;
}

export interface DecodedAuthData {
  accessToken: string;
  consumerKey: string;
  consumerSecret: string;
  tokenExpiry: string;
  profileId: string;
  userId: string;
  refreshToken?: string;
  refreshTokenExpiry?: string;
  userInfo?: UserInfo;
  profileInfo?: ProfileInfo;
  selectedProfile?: SelectedProfile;
}

export const extractAuthTokenFromURL = (): string | null => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const authParam = urlParams.get('auth');
    
    if (!authParam) {
      return null;
    }

    return authParam;
  } catch (error) {
    console.error('Failed to extract auth token from URL:', error);
    return null;
  }
};

/**
 * Extracts and decodes authentication data from URL parameters
 */
export const extractAuthDataFromURL = (): DecodedAuthData | null => {
  try {
    console.log('🔍 Extracting auth data from URL...');
    const urlParams = new URLSearchParams(window.location.search);
    const authParam = urlParams.get('auth');
    
    console.log('🔑 Auth param found:', !!authParam);
    if (authParam) {
      console.log('🔑 Auth param length:', authParam.length);
      console.log('🔑 Auth param preview:', authParam.substring(0, 50) + '...');
    }
    
    if (!authParam) {
      return null;
    }

    // Try to decode as JWT token first (your auth token appears to be JWT)
    try {
      console.log('🔐 Attempting JWT decode...');
      // JWT tokens have 3 parts separated by dots
      const parts = authParam.split('.');
      console.log('🔐 JWT parts count:', parts.length);
      
      if (parts.length === 3) {
        console.log('🔐 JWT structure looks correct, decoding payload...');
        // Decode the payload part (second part)
        const payload = parts[1];
        console.log('🔐 Payload part length:', payload.length);
        
        // Add padding if needed for base64
        const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
        const decodedString = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
        console.log('🔐 Decoded payload:', decodedString);
        
        const authData: DecodedAuthData = JSON.parse(decodedString);
        console.log('🔐 Parsed auth data keys:', Object.keys(authData));
        
        // Validate required fields
        if (!authData.accessToken || !authData.consumerKey || !authData.consumerSecret) {
          console.error('Missing required authentication parameters in JWT payload');
          console.error('Available keys:', Object.keys(authData));
          return null;
        }
        
        console.log('✅ JWT decode successful');
        return authData;
      } else {
        console.log('🔐 Not a valid JWT structure (expected 3 parts)');
      }
    } catch (jwtError) {
      console.log('❌ JWT decode failed:', jwtError);
      console.log('🔐 Not a JWT token, trying base64 decode...');
    }

    // Fallback: try base64 decode (for backward compatibility)
    try {
      console.log('🔐 Attempting base64 decode...');
      const decodedString = atob(authParam);
      console.log('🔐 Base64 decoded string:', decodedString);
      
      const authData: DecodedAuthData = JSON.parse(decodedString);
      console.log('🔐 Base64 parsed auth data keys:', Object.keys(authData));

      // Validate required fields
      if (!authData.accessToken || !authData.consumerKey || !authData.consumerSecret) {
        console.error('Missing required authentication parameters');
        console.error('Available keys:', Object.keys(authData));
        return null;
      }

      console.log('✅ Base64 decode successful');
      return authData;
    } catch (base64Error) {
      console.error('❌ Failed to decode as base64:', base64Error);
    }

    return null;
  } catch (error) {
    console.error('Failed to extract auth data from URL:', error);
    return null;
  }
};

/**
 * Initializes Redux state with authentication data
 */
export const initializeAuthState = (authData: DecodedAuthData, authToken:string  ): boolean => {
  try {
    // Debug logging
    console.log('Initializing auth state with data:', {
      accessToken: authData.accessToken?.substring(0, 20) + '...',
      consumerKey: authData.consumerKey?.substring(0, 20) + '...',
      consumerSecret: authData.consumerSecret?.substring(0, 20) + '...',
      profileId: authData.profileId,
      userId: authData.userId
    });

    // Prepare token payload for Redux store
    const tokenPayload = {
      Response: {
        Auth1dot0: {
          AccessToken: authData.accessToken,
          ConsumerKey: authData.consumerKey, // Use the full key as-is
          ConsumerSecret: authData.consumerSecret,
          ExpiryAt: authData.tokenExpiry
        },
        RefreshToken: authData.refreshToken,
        RefreshTokenExpiryAt: authData.refreshTokenExpiry,
        ProfileId: authData.profileId,
        UserId: authData.userId,
        UserInfo: authData.userInfo,
        ProfileInfo: authData.profileInfo
      }
    };

    // Debug: Log the structure being stored in Redux
    console.log('Token payload structure:', {
      hasAuth1dot0: !!tokenPayload.Response.Auth1dot0,
      hasAccessToken: !!tokenPayload.Response.Auth1dot0.AccessToken,
      hasConsumerKey: !!tokenPayload.Response.Auth1dot0.ConsumerKey,
      hasConsumerSecret: !!tokenPayload.Response.Auth1dot0.ConsumerSecret,
      consumerKeyLength: tokenPayload.Response.Auth1dot0.ConsumerKey?.length,
      consumerKeyValue: tokenPayload.Response.Auth1dot0.ConsumerKey
    });

    // Dispatch to Redux store
    store.dispatch(setAuthTokens(tokenPayload));
    // jwt token wll be store here
    store.dispatch(setAuthShareToken(authToken));

    // Verify the state was updated correctly
    const updatedState = store.getState();
    // console.log("Login slice:", !!updatedState.loginSlice.authShareToken)
    console.log('Redux state after dispatch:', {
      hasToken: !!updatedState.loginSlice?.token,
      hasTokenObj: !!updatedState.loginSlice?.tokenObj,
      tokenStructure: (updatedState.loginSlice?.token as Record<string, unknown>)?.Response?.Auth1dot0,
      tokenObjStructure: (updatedState.loginSlice?.tokenObj as Record<string, unknown>)?.Response?.Auth1dot0
    });

    // Set cookies for compatibility with existing code
    Cookies.set('jeetat', JSON.stringify({
      token: authData.accessToken,
      Expiry: authData.tokenExpiry
    }));

    if (authData.refreshToken) {
      Cookies.set('jeetrt', JSON.stringify({
        token: authData.refreshToken,
        Expiry: authData.refreshTokenExpiry
      }));
    }
  // token token stored for share in redirect with different apps
    if(authToken){
      Cookies.set('jeetst', typeof authToken === 'string' ? authToken : JSON.stringify(authToken));
    }

    // Store additional user info in localStorage if needed
    if (authData.userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(authData.userInfo));
    }

    if (authData.selectedProfile) {
      localStorage.setItem('selectedProfile', JSON.stringify(authData.selectedProfile));
    }

    return true;
  } catch (error) {
    console.error('Failed to initialize auth state:', error);
    return false;
  }
};

/**
 * Clears authentication data from URL and redirects to clean URL
 */
export const clearAuthFromURL = (): void => {
  try {
    // Remove auth parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('auth');
    
    // Replace URL without the auth parameter
    window.history.replaceState({}, document.title, url.pathname + url.search);
  } catch (error) {
    console.error('Failed to clear auth from URL:', error);
  }
};

/**
 * Checks if user is authenticated by checking Redux state and cookies
 */
export const isUserAuthenticated = (): boolean => {
  try {
    console.log('🔍 Checking if user is authenticated...');
    
    // Check Redux state first
    const reduxState = store.getState();
    const hasReduxAuth = reduxState.loginSlice?.token?.Response?.Auth1dot0?.AccessToken;
    
    console.log('🔍 Redux auth check:', {
      hasLoginSlice: !!reduxState.loginSlice,
      hasToken: !!reduxState.loginSlice?.token,
      hasResponse: !!reduxState.loginSlice?.token?.Response,
      hasAuth1dot0: !!reduxState.loginSlice?.token?.Response?.Auth1dot0,
      hasAccessToken: !!reduxState.loginSlice?.token?.Response?.Auth1dot0?.AccessToken
    });

    if (hasReduxAuth) {
      console.log('✅ User authenticated via Redux state');
      return true;
    }

    console.log('🔍 Redux auth failed, checking cookies...');
    
    // Fallback to cookie check
    const cookieToken = Cookies.get('jeetat');
    if (cookieToken) {
      console.log('🔍 Found jeetat cookie');
      const parsedToken = JSON.parse(cookieToken);
      const hasToken = !!parsedToken?.token;
      console.log('🔍 Cookie token check:', hasToken);
      return hasToken;
    }
    
    // if token find from cookie then put in redux loginSlice
    const cookieAuthToken = Cookies.get('jeetst');
    if(cookieAuthToken) {
      console.log('🔍 Found jeetst cookie, dispatching to Redux');
      store.dispatch(setAuthShareToken(cookieAuthToken));
    }

    console.log('❌ No authentication found in Redux or cookies');
    return false;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

/**
 * Main function to handle authentication initialization from URL
 */
export const handleAuthInitialization = (): boolean => {
  try {
    console.log('🔐 Starting auth initialization...');
    console.log('🔍 Current URL:', window.location.href);
    
    // Extract auth data from URL
    const authData = extractAuthDataFromURL();
    const authToken = extractAuthTokenFromURL();
    
    console.log('📋 Extracted auth data:', authData ? 'Found' : 'Not found');
    console.log('🔑 Extracted auth token:', authToken ? 'Found' : 'Not found');
    
    if (!authData) {
      console.log('❌ No auth data in URL, checking if user is already authenticated...');
      // No auth data in URL, check if user is already authenticated
      if (isUserAuthenticated()) {
        console.log('✅ User already authenticated');
        return true;
      }
      console.log('❌ User not authenticated');
      return false;
    }

    console.log('✅ Auth data found, initializing auth state...');
    
    // Initialize auth state
    const success = initializeAuthState(authData, authToken);
    
    if (success) {
      console.log('✅ Auth state initialized successfully, clearing URL...');
      // Clear auth data from URL
      clearAuthFromURL();
      return true;
    }

    console.log('❌ Failed to initialize auth state');
    return false;
  } catch (error) {
    console.error('Failed to handle auth initialization:', error);
    return false;
  }
};

/**
 * Redirects to login app if authentication fails
 */
export const redirectToLoginApp = (): void => {
  const loginAppUrl = import.meta.env.VITE_LOGIN_APP_URL || 'https://devlogin.musafirbiz.com';
  const currentPath = window.location.pathname + window.location.search;
  
  // Redirect to login app with return path
  window.location.href = `${loginAppUrl}?returnTo=${encodeURIComponent(currentPath)}`;
}; 