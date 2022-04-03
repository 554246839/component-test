import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import monacoEditorPlugin from "vite-plugin-monaco-editor"
import { viteMockServe } from 'vite-plugin-mock'
// import Components from "unplugin-vue-components/vite"

import { server } from './config'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
    }
  },
  plugins: [
    vue(),
    viteMockServe(),
    monacoEditorPlugin(),
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/**/*.ts'],
      fix: true
    }),
    // Components({
    //   resolvers: [
    //     name => {}
    //   ]
    // })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/style/variables.scss";`
      }
    }
  },
  server,
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            let prefix = ''
            const fileName = id.split('node_modules/')[1].split('/')
            if (/.*\.(js|mjs|css)(\?|$)/.test(id)) {
              prefix = RegExp.$1 === 'css' ? 'css/' : 'js/'
            }
            return prefix + fileName[0].replace('@', '')
          }
        }
      }
    }
  }
})
