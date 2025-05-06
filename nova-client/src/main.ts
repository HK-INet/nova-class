import { createApp } from 'vue'
import { useThemeStore } from './stores/useThemeStore'
import 'uno.css'
import './style.css'
import './style/theme.css'
import App from './App.vue'

// pinia存储
import { createPinia } from 'pinia'
const pinia = createPinia()

// 路由
import { router } from './router/index'

createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app')


// 主题初始化
const theme = useThemeStore();
theme.init()
