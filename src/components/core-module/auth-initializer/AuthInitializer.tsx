import React, { useEffect, useState } from 'react';
import { handleAuthInitialization, redirectToLoginApp } from '../../../utility/authHandler';
import LoadingScreen from '../loading-screen/LoadingScreen';

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Handle authentication initialization
        const authSuccess = handleAuthInitialization();
        
        if (authSuccess) {
          setIsInitialized(true);
        } else {
          // Authentication failed, redirect to login app
          redirectToLoginApp();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        redirectToLoginApp();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (isLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (!isInitialized) {
    return <LoadingScreen isLoading={true} />;
  }

  return <>{children}</>;
};

export default AuthInitializer; 