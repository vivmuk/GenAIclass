import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // For build-time access (if needed)
        'process.env.API_KEY': JSON.stringify(env.VENICE_API_KEY || env.API_KEY || ''),
        'process.env.VENICE_API_KEY': JSON.stringify(env.VENICE_API_KEY || env.API_KEY || ''),
        // Explicitly expose VENICE_API_KEY as VITE_VENICE_API_KEY for client access
        'import.meta.env.VITE_VENICE_API_KEY': JSON.stringify(env.VENICE_API_KEY || env.VITE_VENICE_API_KEY || env.API_KEY || ''),
        'import.meta.env.VITE_API_KEY': JSON.stringify(env.VENICE_API_KEY || env.VITE_VENICE_API_KEY || env.API_KEY || ''),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
