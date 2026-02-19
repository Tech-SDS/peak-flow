import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: '/', // Root for Vercel deployment
  resolve: {
    dedupe: ['leaflet']
  },
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      // Proxy OSRM requests through Vite to avoid CORS issues
      '/osrm-proxy': {
        target: 'https://router.project-osrm.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/osrm-proxy/, ''),
        timeout: 15000
      },
      '/osrm-de-proxy': {
        target: 'https://routing.openstreetmap.de',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/osrm-de-proxy/, ''),
        timeout: 15000
      },
      '/ors-proxy': {
        target: 'https://api.openrouteservice.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ors-proxy/, ''),
        timeout: 15000
      }
    }
  }
}))
