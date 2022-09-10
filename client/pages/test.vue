<script lang="ts" setup>
const active = ref(false);
</script>

<style lang="postcss"></style>

<template>
  <div class="tw-relative tw-z-30 tw-h-screen tw-bg-white">
    <button @click="active = true">dialog</button>
    <lazy-ada-calculator></lazy-ada-calculator>
  </div>
</template>
