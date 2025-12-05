import EnvironmentPlugin from 'vite-plugin-environment';
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

delete process.env['CommonProgramFiles(x86)'];
delete process.env['ProgramFiles(x86)'];

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const config = {
    plugins: [react(), EnvironmentPlugin('all')],
    resolve: {
      base: '/',
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 8080,
    },
    preview: {
      port: 8080,
    },
    define: {
      'process.env': env,
    },
  };
  return defineConfig(config);
};
