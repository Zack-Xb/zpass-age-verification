import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import wasm from 'vite-plugin-wasm';
import WebWorkerPlugin from 'vite-plugin-webworker-service';

// https://vitejs.dev/config/
export default defineConfig({
  host: '94.130.171.4',
	port: 5173,
  worker: {
    format: 'es',
  },
  plugins: [wasm(), WebWorkerPlugin(), react()],
  build: {
    target: 'esnext',
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ['@aleohq/wasm', '@aleohq/sdk'],
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'cross-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    },
  },
});
