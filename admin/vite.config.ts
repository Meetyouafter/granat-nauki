import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@constants': fileURLToPath(new URL('./src/constants/index.ts', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/types/index.ts', import.meta.url)),
    },
  },
  server: {
    port: 3001,
    host: true,
  },
})
