import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import setupI18n from './locale'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import '@/assets/style/common.css'

const pinia = createPinia()
const i18n = setupI18n()
const app = createApp(App).use(router).use(pinia)

app.use(ElementPlus, {
  i18n: i18n.global.t,
})
  .use(i18n)

app.mount('#app')
