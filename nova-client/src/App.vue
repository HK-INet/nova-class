<script setup lang="ts">
import GlobalTransition from '@/components/GlobalTransition.vue'
</script>

<template>
  <GlobalTransition/>
    <div>
      <router-link to="/home">跳转到首页</router-link>
      <router-link to="/login">跳转到登陆</router-link>
      <router-view/>
    </div>
</template>

<style scoped>
.app-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}
</style>