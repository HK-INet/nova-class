<template>
  <Teleport to="body">
    <div
      v-if="store.visible"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <!-- ✨ 背景特效层：z-40，比 Lottie（z-50 子元素）更低 -->
      <div
  class="absolute inset-0 z-40 bg-gradient-to-br from-purple-500 via-indigo-500 to-teal-400
         animate-bg-soft-fade"
></div>

      <!-- Lottie 层：z-50（默认） -->
      <div ref="animContainer" class="w-full h-full z-50"></div>
    </div>
  </Teleport>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTransStore } from '@/stores/useTransStore'
import lottie, { AnimationItem } from 'lottie-web'
import fullJsonUrl from '/lottie/star2.json?url'

/* ---------------- 基本状态 ---------------- */
const store = useTransStore()
const animContainer = ref<HTMLElement | null>(null)
let anim: AnimationItem | null = null

/* 两段帧区间 */
const EXIT_SEG:  [number, number] = [0,  30]   // 0–1 帧：退出
const ENTER_SEG: [number, number] = [31, 80]   // 0–30 帧：进入

/* 入口函数：初始化并播放退出段 */
function initAndPlayExit() {
  if (!animContainer.value) return skipExit()

  anim?.destroy()

  let playingExit = true

  anim = lottie.loadAnimation({
    container: animContainer.value,
    renderer:  'svg',
    loop:      false,
    autoplay:  true,              // ← 直接播
    path:      fullJsonUrl,
    initialSegment: EXIT_SEG,     // ← 第一次只播 [0,5]
  })

  anim.addEventListener('complete', () => {
    if (playingExit) {
      store.pendingNext?.()
      store.pendingNext = null

      playingExit = false
      /* 第二段改用 playSegments */
      anim!.playSegments(ENTER_SEG, true)
    } else {
      store.visible = false
      store.phase   = 'idle'      // 复位，之后还能再触发
    }
  })
}

/* 兜底：跳过动画直接放行 */
function skipExit() {
  store.pendingNext?.()
  store.pendingNext = null
  store.visible = false
}

/* 只监听 “exit” 触发 */
watch(
  () => store.phase,
  phase => {
    if (phase === 'exit') {
      store.visible = true
      initAndPlayExit()
    }
  },
  { flush: 'post' }
)
</script>
