import { createApp } from 'vue'
import { useThemeStore } from './stores/useThemeStore'
import GlobalTransition from './components/GlobalTransition.vue'
import 'uno.css'
import './style.css'
import './style/theme.css'
import App from './App.vue'

// pinia存储
import { createPinia } from 'pinia'
const pinia = createPinia()


import { router } from './router/index'
import { useTransStore } from './stores/useTransStore'


createApp(App)
    .use(pinia)
    .use(router)
    .component('GlobalTransition', GlobalTransition)
    .mount('#app')

// 主题初始化
const theme = useThemeStore();
theme.init()

const transStore = useTransStore()

router.beforeEach((to, from, next) => {
    console.log('[路由守卫] beforeEach', to.fullPath)
    transStore.visible = true
    transStore.phase = 'exit'
    transStore.pendingNext = next
})