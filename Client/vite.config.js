import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // Your backend server
        changeOrigin: true, // Ensures proper headers are set
        rewrite: (path) => path.replace(/^\/api/, '') // Removes '/api' from the URL when proxying
      }
    }
  }
})

