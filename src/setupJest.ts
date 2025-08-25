// Mock Vite's import.meta.env
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_LOGIN_APP_URL: process.env.VITE_TEST_LOGIN_APP_URL || 'http://localhost:3000',
        VITE_API_BASE_URL: process.env.VITE_TEST_API_BASE_URL || 'http://localhost:8080',
        VITE_APP_ENV: process.env.VITE_TEST_APP_ENV || 'test',
        VITE_API_GATEWAY_URL: process.env.VITE_API_GATEWAY_URL || 'https://saas.qa.gateway.musafirbiz.com',
        VITE_LOGIN_API_URL: process.env.VITE_LOGIN_API_URL || 'https://saas.qa.api.musafirbiz.com',
        VITE_API_VERSION: process.env.VITE_API_VERSION || '/api/v1/',
        VITE_SECRET_KEY: process.env.VITE_SECRET_KEY || 'musafir2.0secret',
        // Add other environment variables as needed
      }
    }
  },
  writable: true
});

// Mock process.env for any Node.js environment variables
process.env.NODE_ENV = 'test';
process.env.REACT_APP_ENV = 'test'; 