import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTransStore = defineStore('trans', () => {
    const visible = ref(false)
    const phase = ref<'exit' | 'enter'>('enter')
    // 暂存路由守卫的 next() 函数
    const pendingNext = ref<(() => void) | null>(null)

    return { visible, phase, pendingNext }
})