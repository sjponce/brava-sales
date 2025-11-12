import EnvironmentPlugin from 'vite-plugin-environment';
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import fs from 'fs';

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
      https: {
        key: fs.readFileSync(path.resolve(__dirname, 'localhost+2-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'localhost+2.pem')),
      },
      port: 5173,
    },
    preview: {
      port: 5173,
    },
    define: {
      'process.env': env,
    },
  };
  return defineConfig(config);
};
