import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: 'Realist_Logo.png',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Realist',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'Realist_Logo.png',
            sizes: '255x255',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
