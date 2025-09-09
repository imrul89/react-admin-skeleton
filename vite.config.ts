import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      __API_BASE_URL__: JSON.stringify(
        env.VITE_API_BASE_URL
      ),
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@components': path.resolve(__dirname, './src/components'),
        '@features': path.resolve(__dirname, './src/features'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@layouts': path.resolve(__dirname, './src/layouts'),
        '@models': path.resolve(__dirname, './src/models'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@reducers': path.resolve(__dirname, './src/reducers'),
        '@services': path.resolve(__dirname, './src/services'),
        '@contexts': path.resolve(__dirname, './src/contexts'),
        '@utils': path.resolve(__dirname, './src/utils'),
      },
    },
    build: {
      outDir: mode === 'prod' ? 'dist-prod' : 'dist',
      chunkSizeWarningLimit: 5000,
    },
  };
});
