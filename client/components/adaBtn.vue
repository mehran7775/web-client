<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    width: number | string;
    height: number | string;
    type: "button" | "submit" | "reset";
  }>(),
  {
    width: "auto",
    height: "auto",
    type: "button",
  }
);
</script>

<style lang="postcss" scoped>
button {
  @apply tw-min-w-0 tw-justify-center;
  background-color: var(--c-default-rgb);
  border-radius: var(--border-radius-root);
  font-size: 0.8334rem;
  font-weight: bold;
  position: relative;
  overflow: hidden;
}
</style>

<template>
  <button :type="type" :style="{ width: width, height: height }">
    <slot></slot>
  </button>
</template>
