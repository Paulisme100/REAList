import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'


export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',          
      filename: 'sw.js',      

      registerType: 'autoUpdate',

      includeAssets: ['Realist_Logo.png'], 

      devOptions: {
        enabled: true,     
      },

      manifest: {
        name: 'Realist',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/Realist_Logo.png',
            sizes: '225x225',
            type: 'image/png',
          },
          {
            src: '/Realist_Logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/Realist_Logo.png',
            sizes: '256x256',
            type: 'image/png',
          }
        ],
      },
    }),
  ],
})