import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// This ensures Vite knows the root is exactly where the config file is
export default defineConfig({
  plugins: [react()],
  root: './',
  build: {
    outDir: 'dist',
  }
})
