import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    proxy: {
      '/cursor-api': {
        target: 'https://api.cursor.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cursor-api/, ''),
      },
    },
  },
  preview: {
    host: true,
    allowedHosts: true,
    proxy: {
      '/cursor-api': {
        target: 'https://api.cursor.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cursor-api/, ''),
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
