import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const layer = (name: string) => fileURLToPath(new URL(`./src/${name}`, import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': layer('app'),
      '@pages': layer('pages'),
      '@widgets': layer('widgets'),
      '@features': layer('features'),
      '@entities': layer('entities'),
      '@shared': layer('shared'),
    },
  },
  server: {
    port: 3001,
    host: true,
  },
})
