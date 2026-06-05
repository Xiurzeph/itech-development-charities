import { defineConfig } from 'vite';

export default defineConfig({
  // This is CRITICAL for GitHub Pages
  base: '/itech-development-charities/',
  build: {
    outDir: 'dist',
    // Ensures assets are handled correctly
    rollupOptions: {
      input: './index.html'
    }
  }
});