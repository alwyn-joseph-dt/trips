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
    const urlParams = new URLSearchParams(window.location.search);
    const authParam = urlParams.get('auth');
    
    if (!authParam) {
      return null;
    }

    // Decode the base64 encoded auth data
    const decodedString = atob(authParam);
    const authData: DecodedAuthData = JSON.parse(decodedString);

    // Validate required fields
    if (!authData.accessToken || !authData.consumerKey || !authData.consumerSecret) {
      console.error('Missing required authentication parameters');
      return null;
    }


    return authData;
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
      ,
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
    // Check Redux state first
    const reduxState = store.getState();
    const hasReduxAuth = reduxState.loginSlice?.token?.Response?.Auth1dot0?.AccessToken;

    if (hasReduxAuth) {
      return true;
    }

    // Fallback to cookie check
    const cookieToken = Cookies.get('jeetat');
    if (cookieToken) {
      const parsedToken = JSON.parse(cookieToken);
      return !!parsedToken?.token;
    }
    // if token find from cookie then put in redux loginSlice
    const cookieAuthToken = Cookies.get('jeetst');
    if(cookieAuthToken) store.dispatch(setAuthShareToken(cookieAuthToken))

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
    // Extract auth data from URL
    const authData = extractAuthDataFromURL();
    const authToken = extractAuthTokenFromURL();
    
    if (!authData) {
      // No auth data in URL, check if user is already authenticated
      if (isUserAuthenticated()) {
        return true;
      }
      return false;
    }

    // Initialize auth state
    const success = initializeAuthState(authData, authToken);
    
    if (success) {
      // Clear auth data from URL
      clearAuthFromURL();
      return true;
    }

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