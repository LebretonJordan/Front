<script setup lang="ts">
const colorMode = useColorMode()

const changeColor = () => (colorMode.preference = (colorMode.value === 'light' ? 'dark' : 'light'))
</script>

<template>
  <button class="!outline-none" @click="changeColor">
    <div class="i-carbon-sun dark:i-carbon-moon" />
  </button>
</template>
