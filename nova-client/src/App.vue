<script setup lang="ts">
import GlobalTransition from '@/components/GlobalTransition.vue'
</script>

<template>
  <GlobalTransition/>
    <div class="app-container">
      <div class="route">
        <router-link to="/home">跳转到首页</router-link>
        <router-link to="/login">跳转到登陆</router-link>
      </div>
      <router-view/>
    </div>
</template>

<style scoped>
.app-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background: var(--bg);
}
.route {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px;
  z-index: 9999;
}
</style>