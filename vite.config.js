import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // This is CRITICAL for GitHub Pages
  base: '/itech-development-charities/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html'
    }
  }
});