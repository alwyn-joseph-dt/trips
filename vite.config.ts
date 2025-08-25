import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    // Base path for production build - adjust this based on your ALB path configuration
    base: mode === 'production' ? '/trips/' : '/',
    define: {
      global: 'globalThis',
      __APP_ENV__: JSON.stringify(env.REACT_APP_ENV || env.VITE_APP_ENV),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.REACT_APP_ENV': JSON.stringify(env.REACT_APP_ENV || env.VITE_APP_ENV),
    },
    server: {
      port: parseInt(env.VITE_DEV_SERVER_PORT) || 9000,
      host: true, // Allow access from network
      // Enable HMR with overlay
      hmr: {
        overlay: true,
      },
    },
    preview: {
      port: parseInt(env.VITE_PREVIEW_SERVER_PORT) || 8080,
      host: true,
    },
    build: {
      outDir: `dist`,
      sourcemap: mode !== 'production',
      minify: mode === 'production' ? 'esbuild' : false,
      chunkSizeWarningLimit: 2500,
      target: 'es2015',
      cssTarget: 'chrome80',
      // Performance optimizations
      reportCompressedSize: true,
      rollupOptions: {
        output: {
          manualChunks: {
            // Split React and related libraries
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            // Split MUI libraries
            'mui-vendor': [
              '@mui/material', 
              '@mui/icons-material', 
              '@mui/x-date-pickers',
              '@emotion/react',
              '@emotion/styled'
            ],
            // Split Redux
            'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux', 'redux-persist'],
            // Split other heavy libraries
            'utils-vendor': ['moment', 'dayjs', 'formik', 'yup', 'crypto-js'],

          },
          // Optimize chunk naming
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
            return `js/[name]-[hash].js`;
          },
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/\.(css)$/.test(assetInfo.name)) {
              return `css/[name]-[hash].${ext}`;
            }
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
              return `images/[name]-[hash].${ext}`;
            }
            if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
              return `fonts/[name]-[hash].${ext}`;
            }
            return `assets/[name]-[hash].${ext}`;
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@utility': path.resolve(__dirname, './src/utility'),
        '@assets': path.resolve(__dirname, './src/assets'),
      },
    },
    css: {
      postcss: './postcss.config.js',
    },
    // Performance optimizations
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@mui/material',
        '@mui/icons-material',
        '@reduxjs/toolkit',
        'react-redux',
      ],
    },
  };
}); 