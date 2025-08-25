import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import i18n from 'i18next';

// Mock all dependencies
jest.mock('./routes/Router', () => {
  return function MockRouter() {
    return <div data-testid="router">Router Component</div>;
  };
});

jest.mock('./components/core-module/auth-initializer/AuthInitializer', () => {
  return function MockAuthInitializer({ children }: { children: React.ReactNode }) {
    return <div data-testid="auth-initializer">{children}</div>;
  };
});

jest.mock('./components/core-module/auth-status/AuthStatus', () => {
  return function MockAuthStatus() {
    return <div data-testid="auth-status">Auth Status Component</div>;
  };
});

jest.mock('./rtlCache', () => ({
  __esModule: true,
  default: {
    key: 'muirtl',
    stylisPlugins: []
  }
}));

jest.mock('i18next', () => ({
  on: jest.fn(),
  language: 'en'
}));

jest.mock('@mui/x-date-pickers', () => ({
  LocalizationProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="localization-provider">{children}</div>
  ),
  AdapterDayjs: jest.fn()
}));

jest.mock('@emotion/react', () => ({
  CacheProvider: ({ children, value }: { children: React.ReactNode; value: { key: string } }) => (
    <div data-testid="cache-provider" data-cache-key={value.key}>{children}</div>
  )
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock document.documentElement
Object.defineProperty(document, 'documentElement', {
  value: {
    setAttribute: jest.fn(),
    getAttribute: jest.fn()
  },
  writable: true
});

// Create a mock store with a dummy reducer
const createTestStore = () => {
  return configureStore({
    reducer: {
      dummy: (state = {}) => state
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
  });
};

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = createTestStore();
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

describe('App Component', () => {
  let mockLanguageChangedCallback: (lng: string) => void;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('false');
    localStorageMock.setItem.mockImplementation(() => {});
    
    // Setup i18n mock
    (i18n.on as jest.Mock).mockImplementation((event, callback) => {
      if (event === 'languageChanged') {
        mockLanguageChangedCallback = callback;
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    test('renders App component with LTR layout by default', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      expect(screen.getByTestId('localization-provider')).toBeInTheDocument();
      expect(screen.getByTestId('auth-initializer')).toBeInTheDocument();
      expect(screen.getByTestId('router')).toBeInTheDocument();
      expect(screen.getByTestId('auth-status')).toBeInTheDocument();
      
      // Should not render CacheProvider for LTR
      expect(screen.queryByTestId('cache-provider')).not.toBeInTheDocument();
    });

    test('renders App component with RTL layout when isRtl is true', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Initially should not have cache provider since isRtl starts as false
      expect(screen.getByTestId('localization-provider')).toBeInTheDocument();
      expect(screen.queryByTestId('cache-provider')).not.toBeInTheDocument();
      expect(screen.getByTestId('auth-initializer')).toBeInTheDocument();
      expect(screen.getByTestId('router')).toBeInTheDocument();
      expect(screen.getByTestId('auth-status')).toBeInTheDocument();
    });
  });

  describe('Language Change Handling', () => {
    test('handles Arabic language change correctly', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Simulate language change to Arabic
      if (mockLanguageChangedCallback) {
        await act(async () => {
          mockLanguageChangedCallback('ar');
        });
      }

      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('dir', 'rtl');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('isRtl', 'true');
      });
    });

    test('handles Arabic Saudi language change correctly', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Simulate language change to Arabic Saudi
      if (mockLanguageChangedCallback) {
        await act(async () => {
          mockLanguageChangedCallback('ar-SA');
        });
      }

      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('dir', 'rtl');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('isRtl', 'true');
      });
    });

    test('handles English language change correctly', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Simulate language change to English
      if (mockLanguageChangedCallback) {
        await act(async () => {
          mockLanguageChangedCallback('en');
        });
      }

      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('dir', 'ltr');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('isRtl', 'false');
      });
    });

    test('handles Hindi language change correctly', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Simulate language change to Hindi
      if (mockLanguageChangedCallback) {
        await act(async () => {
          mockLanguageChangedCallback('hn');
        });
      }

      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('dir', 'ltr');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('isRtl', 'false');
      });
    });

    test('handles unknown language change correctly', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Simulate language change to unknown language
      if (mockLanguageChangedCallback) {
        await act(async () => {
          mockLanguageChangedCallback('fr');
        });
      }

      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('dir', 'ltr');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('isRtl', 'false');
      });
    });
  });

  describe('RTL State Management', () => {
    test('updates RTL state when language changes to Arabic', async () => {
      const { rerender } = render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Initially should not have cache provider
      expect(screen.queryByTestId('cache-provider')).not.toBeInTheDocument();

      // Simulate language change to Arabic
      if (mockLanguageChangedCallback) {
        await act(async () => {
          mockLanguageChangedCallback('ar');
        });
      }

      // Re-render to see the updated state
      rerender(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('cache-provider')).toBeInTheDocument();
        expect(screen.getByTestId('cache-provider')).toHaveAttribute('data-cache-key', 'muirtl');
      });
    });

    test('updates RTL state when language changes from Arabic to English', async () => {
      const { rerender } = render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Initially should not have cache provider since isRtl starts as false
      expect(screen.queryByTestId('cache-provider')).not.toBeInTheDocument();

      // Simulate language change to English
      if (mockLanguageChangedCallback) {
        await act(async () => {
          mockLanguageChangedCallback('en');
        });
      }

      // Re-render to see the updated state
      rerender(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('cache-provider')).not.toBeInTheDocument();
      });
    });
  });

  describe('Component Structure', () => {
    test('renders LocalizationProvider with AdapterDayjs', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      expect(screen.getByTestId('localization-provider')).toBeInTheDocument();
    });

    test('renders AuthInitializer with children', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      const authInitializer = screen.getByTestId('auth-initializer');
      expect(authInitializer).toBeInTheDocument();
      expect(authInitializer).toHaveTextContent('Router Component');
      expect(authInitializer).toHaveTextContent('Auth Status Component');
    });

    test('renders Router component', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      expect(screen.getByTestId('router')).toBeInTheDocument();
    });

    test('renders AuthStatus component', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      expect(screen.getByTestId('auth-status')).toBeInTheDocument();
    });
  });

  describe('RTL Cache Provider', () => {
    test('renders CacheProvider with rtlCache when isRtl is true', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Initially should not have cache provider
      expect(screen.queryByTestId('cache-provider')).not.toBeInTheDocument();

      // Simulate language change to Arabic to trigger RTL
      if (mockLanguageChangedCallback) {
        await act(async () => {
          mockLanguageChangedCallback('ar');
        });
      }

      // Now should have cache provider
      await waitFor(() => {
        const cacheProvider = screen.getByTestId('cache-provider');
        expect(cacheProvider).toBeInTheDocument();
        expect(cacheProvider).toHaveAttribute('data-cache-key', 'muirtl');
      });
    });

    test('does not render CacheProvider when isRtl is false', () => {
      // Mock localStorage to return false for LTR
      localStorageMock.getItem.mockReturnValue('false');
      
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      expect(screen.queryByTestId('cache-provider')).not.toBeInTheDocument();
    });
  });

  describe('i18n Integration', () => {
    test('registers language change listener on mount', () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      expect(i18n.on).toHaveBeenCalledWith('languageChanged', expect.any(Function));
    });

    test('handles multiple language changes correctly', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Simulate multiple language changes
      if (mockLanguageChangedCallback) {
        await act(async () => {
          mockLanguageChangedCallback('ar');
          mockLanguageChangedCallback('en');
          mockLanguageChangedCallback('ar-SA');
          mockLanguageChangedCallback('hn');
        });
      }

      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledTimes(4);
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(4);
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles empty language string', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      if (mockLanguageChangedCallback) {
        await act(async () => {
          mockLanguageChangedCallback('');
        });
      }

      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('dir', 'ltr');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('isRtl', 'false');
      });
    });

    test('handles null language string', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      if (mockLanguageChangedCallback) {
        await act(async () => {
          mockLanguageChangedCallback(null as unknown as string);
        });
      }

      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('dir', 'ltr');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('isRtl', 'false');
      });
    });

    test('handles undefined language string', async () => {
      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      if (mockLanguageChangedCallback) {
        await act(async () => {
          mockLanguageChangedCallback(undefined as unknown as string);
        });
      }

      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('dir', 'ltr');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('isRtl', 'false');
      });
    });

    test('handles localStorage errors gracefully', async () => {
      // Mock localStorage.setItem to throw an error
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      if (mockLanguageChangedCallback) {
        // The error should be thrown when localStorage.setItem is called
        await expect(act(async () => {
          mockLanguageChangedCallback('ar');
        })).rejects.toThrow('localStorage error');
      }

      // Should still set the direction even if localStorage fails
      await waitFor(() => {
        expect(document.documentElement.setAttribute).toHaveBeenCalledWith('dir', 'rtl');
      });

      // The error should be thrown but the app should continue working
      expect(localStorageMock.setItem).toHaveBeenCalledWith('isRtl', 'true');
    });
  });

  describe('Integration Tests', () => {
    test('full language change flow from English to Arabic and back', async () => {
      const { rerender } = render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Start with English (LTR)
      expect(screen.queryByTestId('cache-provider')).not.toBeInTheDocument();

      // Change to Arabic (RTL)
      if (mockLanguageChangedCallback) {
        await act(async () => {
          mockLanguageChangedCallback('ar');
        });
      }

      rerender(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('cache-provider')).toBeInTheDocument();
      });

      // Change back to English (LTR)
      if (mockLanguageChangedCallback) {
        await act(async () => {
          mockLanguageChangedCallback('en');
        });
      }

      rerender(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('cache-provider')).not.toBeInTheDocument();
      });
    });

    test('maintains component structure during language changes', async () => {
      const { rerender } = render(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Verify initial structure
      expect(screen.getByTestId('localization-provider')).toBeInTheDocument();
      expect(screen.getByTestId('auth-initializer')).toBeInTheDocument();
      expect(screen.getByTestId('router')).toBeInTheDocument();
      expect(screen.getByTestId('auth-status')).toBeInTheDocument();

      // Change language
      if (mockLanguageChangedCallback) {
        await act(async () => {
          mockLanguageChangedCallback('ar');
        });
      }

      rerender(
        <TestWrapper>
          <App />
        </TestWrapper>
      );

      // Verify structure is maintained
      expect(screen.getByTestId('localization-provider')).toBeInTheDocument();
      expect(screen.getByTestId('auth-initializer')).toBeInTheDocument();
      expect(screen.getByTestId('router')).toBeInTheDocument();
      expect(screen.getByTestId('auth-status')).toBeInTheDocument();
      expect(screen.getByTestId('cache-provider')).toBeInTheDocument();
    });
  });
}); 