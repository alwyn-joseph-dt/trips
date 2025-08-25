import { store } from '../store/store';
import { getAuthHeader } from './config/oAuth';

/**
 * Debug utility to check OAuth credentials in Redux state
 */
export const debugOAuthCredentials = () => {
  const state = store.getState();
  const authData = state.loginSlice?.token?.Response?.Auth1dot0;
  
  console.log('=== OAuth Credentials Debug ===');
  console.log('Full Redux state:', state.loginSlice);
  console.log('Auth1dot0 data:', authData);
  
  if (authData) {
    console.log('AccessToken:', authData.AccessToken);
    console.log('ConsumerKey:', authData.ConsumerKey);
    console.log('ConsumerSecret:', authData.ConsumerSecret);
    console.log('ExpiryAt:', authData.ExpiryAt);
    
    // Check for issues
    if (!authData.AccessToken) {
      console.error('❌ AccessToken is missing or undefined');
    }
    if (!authData.ConsumerKey) {
      console.error('❌ ConsumerKey is missing or undefined');
    }
    if (!authData.ConsumerSecret) {
      console.error('❌ ConsumerSecret is missing or undefined');
    }
    if (authData.ConsumerKey && authData.ConsumerKey.includes(':')) {
      console.warn('⚠️ ConsumerKey contains colons - this might cause OAuth issues');
    }
  } else {
    console.error('❌ Auth1dot0 data is missing from Redux state');
  }
  
  console.log('=== End Debug ===');
};

/**
 * Debug utility to check what the API is receiving
 */
export const debugApiAuthData = (endpoint: string, method: string) => {
  const state = store.getState();
  const authOdetails = state?.loginSlice?.token?.Response?.Auth1dot0;
  
  console.log(`=== API Auth Debug for ${method} ${endpoint} ===`);
  console.log('AuthOdetails being passed to getAuthHeader:', authOdetails);
  
  if (authOdetails) {
    console.log('ConsumerKey type:', typeof authOdetails.ConsumerKey);
    console.log('ConsumerKey value:', authOdetails.ConsumerKey);
    console.log('ConsumerSecret type:', typeof authOdetails.ConsumerSecret);
    console.log('ConsumerSecret value:', authOdetails.ConsumerSecret);
    console.log('AccessToken type:', typeof authOdetails.AccessToken);
    console.log('AccessToken value:', authOdetails.AccessToken);
  } else {
    console.error('❌ AuthOdetails is undefined - API call will fail');
  }
  
  console.log('=== End API Debug ===');
};

/**
 * Manual trigger for debugging - call this from console
 */
export const manualDebug = () => {
  console.log('=== Manual Debug Triggered ===');
  debugOAuthCredentials();
  
  // Test OAuth header generation
  const state = store.getState();
  const authOdetails = state?.loginSlice?.token?.Response?.Auth1dot0;
  
  if (authOdetails) {
    console.log('Testing OAuth header generation...');
    const header = getAuthHeader('test/endpoint', 'GET', authOdetails);
    console.log('Generated header:', header);
  }
  
  console.log('=== End Manual Debug ===');
};

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).debugAuth = manualDebug;
} 