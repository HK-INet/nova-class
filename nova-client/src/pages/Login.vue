<script setup lang="ts">
const animated = ref(false)

// 页面挂载后延迟触发动画
onMounted(() => {
  setTimeout(() => {
    animated.value = true
  }, 300)
})
</script>

<template>
  <div class="login-container">
    <!-- 左侧：教师模型（初始被分割线覆盖） -->
    <div class="panel left" :class="{ opened: animated }">
      <!-- <img src="@/assets/teacher.svg" alt="教师" /> -->
    </div>

    <!-- 右侧：学生模型 -->
    <div class="panel right" :class="{ opened: animated }">
      <!-- <img src="@/assets/student.svg" alt="学生" /> -->
    </div>

    <!-- 倾斜分割线（左右各一条） -->
    <div class="divider left" :class="{ moved: animated }"></div>
    <div class="divider right" :class="{ moved: animated }"></div>

    <!-- 你的登录表单可以叠在这里 -->
    <div class="login-form">
      <!-- ... your inputs/buttons ... -->
    </div>
  </div>
</template>

<style scoped>
.login-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: var(--bg);
}

/* 面板初始都占一半宽度 */
.panel {
  position: absolute;
  top: 0; bottom: 0;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 1s ease;
}
.panel img {
  width: 60%;
  user-select: none;
}
/* 左侧面板初始不动，动画后往左移出屏幕 */
.panel.left.opened {
  transform: translateX(-100%);
}
/* 右侧面板往右移出 */
.panel.right.opened {
  transform: translateX(100%);
}

/* 分割线 */
.divider {
  position: absolute;
  top: -20%; bottom: -20%; /* 拉长以保证旋转后足够高 */
  width: 4px;
  background: var(--primary);
  transform-origin: center;
  transform: rotate(45deg);
  transition: transform 1s ease, left 1s ease;
}
/* 左条线从 50% 移到左侧外 */
.divider.left {
  left: 50%;
}
.divider.left.moved {
  left: -20%;
  transform: rotate(45deg);
}
/* 右条线从 50% 移到右侧外 */
.divider.right {
  left: 50%;
}
.divider.right.moved {
  left: calc(100% + 20%);
  transform: rotate(45deg);
}

/* 登录表单，居中显示在中间 */
.login-form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* 根据需要设宽高和内边距 */
  width: 320px;
  padding: 24px;
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: var(--shadow);
  z-index: 10;
}
</style>
