<template>
  <Teleport to="body">
    <div
      v-if="store.visible"
      class="fixed inset-0 z-50 bg-white flex items-center justify-center"
    >
      <div ref="animContainer" class="w-full h-full"></div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTransStore } from '@/stores/useTransStore'
import lottie from 'lottie-web'
import exitUrl  from '/lottie/star.json?url'
import enterUrl from '/lottie/star.json?url'

const store = useTransStore()
const animContainer = ref<HTMLElement|null>(null)

watch(
  () => store.phase,
  (phase) => {
    console.log('[GlobalTransition] phase 改为', phase)
    if (!animContainer.value) {
      console.warn('[GlobalTransition] animContainer 未挂载，跳过动画')
      // 立即放行/隐藏
      if (phase === 'exit') {
        store.pendingNext?.()
        store.pendingNext = null
        store.phase = 'enter'
      } else {
        store.visible = false
      }
      return
    }

    const path = phase === 'exit' ? exitUrl : enterUrl
    console.log('[GlobalTransition] 加载动画文件', path)

    const anim = lottie.loadAnimation({
      container: animContainer.value,
      renderer:  'svg',
      loop:      false,
      autoplay:  true,
      path,
    })

    let done = false
    const timeout = setTimeout(() => {
      console.log('[GlobalTransition] 超时触发 onDone', phase)
      onDone()
    }, 3000)

    function onDone() {
      if (done) return
      done = true
      clearTimeout(timeout)
      console.log('[GlobalTransition] onDone 执行，phase=', phase)

      if (phase === 'exit') {
        console.log('[GlobalTransition] exit 完成，调用 pendingNext 放行')
        store.pendingNext?.()
        store.pendingNext = null
        store.phase = 'enter'
      } else {
        console.log('[GlobalTransition] enter 完成，隐藏遮罩')
        store.visible = false
      }
      anim.destroy()
    }

    anim.addEventListener('complete', () => {
      console.log('[GlobalTransition] lottie complete 事件触发', phase)
      onDone()
    })
  },
  { flush: 'post' }   // ← 关键：等 DOM 渲染之后再执行 callback
)
</script>
