import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), wasm()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './client/src'),
      '@core': resolve(__dirname, './client/core')
    }
  },
  root: './client',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    strictPort: true
  },
  optimizeDeps: {
    exclude: ['onnxruntime-web']
  }
});
