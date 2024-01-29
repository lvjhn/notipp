import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import fs from "fs"
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ["**/*"],
      devOptions: {
        enabled: true
      },
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'sw.js',
      manifest: {
        name: 'Notipp',
        short_name: 'Notipp',
        description: 'Receive notifications from your computer.',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),  
    vue()
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // https: {
    //   key: fs.readFileSync('./certificate/client-ssl.key'),
    //   cert: fs.readFileSync('./certificate/client-ssl.pem'),
    // }
  },
  resolve: {
      alias: {
          '@' : path.resolve(__dirname, 'src/'),
      }
  }
})
