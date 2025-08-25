import { store } from '../store/store';
import { getAuthHeader } from './config/oAuth';

/**
 * Test OAuth authentication by generating a header for a test endpoint
 */
export const testOAuthAuthentication = () => {
  console.log('=== Testing OAuth Authentication ===');
  
  const state = store.getState();
  const authOdetails = (state?.loginSlice?.token as any)?.Response?.Auth1dot0;
  
  if (!authOdetails) {
    console.error('❌ No OAuth credentials found in Redux state');
    return false;
  }
  
  console.log('✅ OAuth credentials found:', {
    hasAccessToken: !!authOdetails.AccessToken,
    hasConsumerKey: !!authOdetails.ConsumerKey,
    hasConsumerSecret: !!authOdetails.ConsumerSecret,
    consumerKeyLength: authOdetails.ConsumerKey?.length,
    consumerKeyStartsWith: authOdetails.ConsumerKey?.substring(0, 20)
  });
  
  // Test OAuth header generation
  try {
    const header = getAuthHeader('test/endpoint', 'GET', authOdetails);
    
    if (header?.Authorization) {
      console.log('✅ OAuth header generated successfully');
      console.log('Header preview:', header.Authorization.substring(0, 100) + '...');
      
      // Check if the header contains the expected components
      const hasConsumerKey = header.Authorization.includes('oauth_consumer_key');
      const hasToken = header.Authorization.includes('oauth_token');
      const hasSignature = header.Authorization.includes('oauth_signature');
      
      console.log('Header validation:', {
        hasConsumerKey,
        hasToken,
        hasSignature
      });
      
      return hasConsumerKey && hasToken && hasSignature;
    } else {
      console.error('❌ OAuth header generation failed - no Authorization header');
      return false;
    }
  } catch (error) {
    console.error('❌ Error generating OAuth header:', error);
    return false;
  }
};

/**
 * Compare with expected format from working curl command
 */
export const compareWithWorkingFormat = () => {
  console.log('=== Comparing with Working Format ===');
  
  const state = store.getState();
  const authOdetails = (state?.loginSlice?.token as any)?.Response?.Auth1dot0;
  
  if (!authOdetails) {
    console.error('❌ No OAuth credentials found');
    return;
  }
  
  // Expected format from working curl
  const expectedConsumerKey = '67a2fcd3aa0b5f0619638c3d%3A67626cbdb63c66c4ab2710c5%3A67626ef1b63c66c4ab2710c6%3A6788c81229026d63c29e2b0d%3A67c56bacf5f1e77f59728094';
  
  console.log('Expected ConsumerKey length:', expectedConsumerKey.length);
  console.log('Actual ConsumerKey length:', authOdetails.ConsumerKey?.length);
  console.log('Length match:', expectedConsumerKey.length === authOdetails.ConsumerKey?.length);
  
  // Check if our key contains the expected segments
  const expectedSegments = expectedConsumerKey.split('%3A');
  const actualSegments = authOdetails.ConsumerKey?.split(':');
  
  console.log('Expected segments count:', expectedSegments.length);
  console.log('Actual segments count:', actualSegments?.length);
  console.log('Segments match:', expectedSegments.length === actualSegments?.length);
  
  // Check first segment
  if (actualSegments && actualSegments.length > 0) {
    console.log('First segment match:', expectedSegments[0] === actualSegments[0]);
  }
};

// Make available globally for console access
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).testOAuth = testOAuthAuthentication;
  (window as unknown as Record<string, unknown>).compareOAuth = compareWithWorkingFormat;
} 