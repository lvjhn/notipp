// vite.config.js
import { defineConfig } from "file:///home/lvjhn/Documents/Projects/notipp/rdt/mobile-client-pwa/node_modules/vite/dist/node/index.js";
import vue from "file:///home/lvjhn/Documents/Projects/notipp/rdt/mobile-client-pwa/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { VitePWA } from "file:///home/lvjhn/Documents/Projects/notipp/node_modules/vite-plugin-pwa/dist/index.js";
import fs from "fs";
import path from "path";
var __vite_injected_original_dirname = "/home/lvjhn/Documents/Projects/notipp/rdt/mobile-client-pwa";
var vite_config_default = defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["**/*"],
      devOptions: {
        enabled: true
      },
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",
      manifest: {
        name: "Notipp",
        short_name: "Notipp",
        description: "Receive notifications from your computer.",
        theme_color: "#ffffff",
        icons: [
          {
            src: "icon.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icon.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    }),
    vue()
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
    https: {
      key: fs.readFileSync("./certificate/client-ssl.key"),
      cert: fs.readFileSync("./certificate/client-ssl.pem")
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src/")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9sdmpobi9Eb2N1bWVudHMvUHJvamVjdHMvbm90aXBwL3JkdC9tb2JpbGUtY2xpZW50LXB3YVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvbHZqaG4vRG9jdW1lbnRzL1Byb2plY3RzL25vdGlwcC9yZHQvbW9iaWxlLWNsaWVudC1wd2Evdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvbHZqaG4vRG9jdW1lbnRzL1Byb2plY3RzL25vdGlwcC9yZHQvbW9iaWxlLWNsaWVudC1wd2Evdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJ1xuaW1wb3J0IGZzIGZyb20gXCJmc1wiXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIFZpdGVQV0Eoe1xuICAgICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXG4gICAgICBpbmNsdWRlQXNzZXRzOiBbXCIqKi8qXCJdLFxuICAgICAgZGV2T3B0aW9uczoge1xuICAgICAgICBlbmFibGVkOiB0cnVlXG4gICAgICB9LFxuICAgICAgc3RyYXRlZ2llczogJ2luamVjdE1hbmlmZXN0JyxcbiAgICAgIHNyY0RpcjogJ3NyYycsXG4gICAgICBmaWxlbmFtZTogJ3N3LmpzJyxcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIG5hbWU6ICdOb3RpcHAnLFxuICAgICAgICBzaG9ydF9uYW1lOiAnTm90aXBwJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdSZWNlaXZlIG5vdGlmaWNhdGlvbnMgZnJvbSB5b3VyIGNvbXB1dGVyLicsXG4gICAgICAgIHRoZW1lX2NvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIGljb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnaWNvbi5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICdpY29uLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZydcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KSwgIFxuICAgIHZ1ZSgpXG4gIF0sXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICBwb3J0OiA1MTczLFxuICAgIGh0dHBzOiB7XG4gICAgICBrZXk6IGZzLnJlYWRGaWxlU3luYygnLi9jZXJ0aWZpY2F0ZS9jbGllbnQtc3NsLmtleScpLFxuICAgICAgY2VydDogZnMucmVhZEZpbGVTeW5jKCcuL2NlcnRpZmljYXRlL2NsaWVudC1zc2wucGVtJyksXG4gICAgfVxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAgICdAJyA6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvJyksXG4gICAgICB9XG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1XLFNBQVMsb0JBQW9CO0FBQ2hZLE9BQU8sU0FBUztBQUNoQixTQUFTLGVBQWU7QUFDeEIsT0FBTyxRQUFRO0FBQ2YsT0FBTyxVQUFVO0FBSmpCLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLFFBQVE7QUFBQSxNQUNOLGNBQWM7QUFBQSxNQUNkLGVBQWUsQ0FBQyxNQUFNO0FBQUEsTUFDdEIsWUFBWTtBQUFBLFFBQ1YsU0FBUztBQUFBLE1BQ1g7QUFBQSxNQUNBLFlBQVk7QUFBQSxNQUNaLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxNQUNWLFVBQVU7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLFlBQVk7QUFBQSxRQUNaLGFBQWE7QUFBQSxRQUNiLGFBQWE7QUFBQSxRQUNiLE9BQU87QUFBQSxVQUNMO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELElBQUk7QUFBQSxFQUNOO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxLQUFLLEdBQUcsYUFBYSw4QkFBOEI7QUFBQSxNQUNuRCxNQUFNLEdBQUcsYUFBYSw4QkFBOEI7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILEtBQU0sS0FBSyxRQUFRLGtDQUFXLE1BQU07QUFBQSxJQUN4QztBQUFBLEVBQ0o7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
