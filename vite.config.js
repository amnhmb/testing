import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: process.env.CF_PAGES ? '/' : '/testing/',
  root: 'src',
  envDir: '../',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        about: resolve(__dirname, 'src/about.html'),
        contact: resolve(__dirname, 'src/contact.html'),
        admin: resolve(__dirname, 'src/admin/index.html'),
      },
    },
  },
});
