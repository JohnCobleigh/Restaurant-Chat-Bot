import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // Your backend server (need to use 5001 here to work locally on both Mac & Windows)
        changeOrigin: true, // Ensures proper headers are set
        rewrite: (path) => path.replace(/^\/api/, '') // Removes '/api' from the URL when proxying
      }
    }
  }
})

