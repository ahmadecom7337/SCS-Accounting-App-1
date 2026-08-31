import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Makes it ready for GitHub Pages out of the box
  server: {
    port: 3000,
    open: false,
  },
});
