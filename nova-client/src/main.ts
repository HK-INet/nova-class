import { createApp } from 'vue'
import 'uno.css'
import './style.css'
import './style/theme.css'
import App from './App.vue'

import { createPinia } from 'pinia'
const pinia = createPinia()

import { router } from './router/index'

createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app')
