import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", {
    state: () => ({
        system: 'light' as 'light' | 'dark',
        user: null as null | 'light' | 'dark',
        mode: 'light' as 'light' | 'dark', // 最终生效的主题
    }),
    actions: {
        // 初始化：读系统偏好 & 本地存储
        init() {
            // 1. 读系统偏好
            const mql = window.matchMedia('(prefers-color-scheme: dark)')
            this.system = mql.matches ? 'dark' : 'light'
            // 2. 监听系统变化
            mql.addEventListener('change', e => {
                this.system = e.matches ? 'dark' : 'light'
                this.apply()
            })
            // 3. 读本地存储
            const saved = localStorage.getItem('theme')
            if (saved === 'light' || saved === 'dark') {
                this.user = saved
            }
            // 4. 计算最终模式
            this.apply()

        },
        // 切换用户偏好
        toggle() {
            this.user = this.mode === 'light' ? 'dark' : 'light'
            localStorage.setItem('theme', this.user)
            this.apply()
        },
        // 计算并应用 data-theme 属性
        apply() {
            this.mode = this.user || this.system
            document.documentElement.setAttribute('data-theme', this.mode)
        },
        // 恢复到“跟随系统”
        reset() {
            this.user = null
            localStorage.removeItem('theme')
            this.apply()
        },
    },
})