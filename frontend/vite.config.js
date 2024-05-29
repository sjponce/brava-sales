import EnvironmentPlugin from 'vite-plugin-environment';
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyUrl = env.VITE_DEV_REMOTE === 'remote' ? env.VITE_BACKEND_SERVER : 'http://localhost:8080/';

  const config = {
    plugins: [react(), EnvironmentPlugin('all')],
    resolve: {
      base: '/',
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: proxyUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      'process.env': env,
    },
  };
  return defineConfig(config);
};
