import EnvironmentPlugin from 'vite-plugin-environment';
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

delete process.env['CommonProgramFiles(x86)'];
delete process.env['ProgramFiles(x86)'];

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
    preview: {
      port: 3000,
    },
    define: {
      'process.env': env,
    },
  };
  return defineConfig(config);
};
