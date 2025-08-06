<template>
  <div class="lending-container">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// Parent component for lending flow
// Child routes (init, complete) will be rendered in router-view
</script>

<style scoped>
.lending-container {
  width: 100%;
  height: 100%;
}
</style> 