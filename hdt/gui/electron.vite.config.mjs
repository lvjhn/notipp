import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import { BASE_PATH } from '../../index.js'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src/renderer/src'), 
        '^': resolve(BASE_PATH), 
        "#": resolve(BASE_PATH + '/common/ui/gui')
      }
    },
    plugins: [vue()]
  }
})
