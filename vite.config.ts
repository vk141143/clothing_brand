import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { tanstackStartPlugin } from '@tanstack/react-start/vite'

export default defineConfig({
  plugins: [
    tanstackStartPlugin(),
    react(),
    tsconfigPaths(),
  ],
  ssr: {
    noExternal: [],
  },
  build: {
    target: 'ES2020',
    minify: 'terser',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
