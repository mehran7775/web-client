<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: number | string;
    selected: number | string;
  }>(),
  {
    selected: "",
  }
);
</script>

<style scoped lang="postcss">
.window {
  @apply tw-hidden;
  min-width: 0;
  flex-grow: 1;
  &.active {
    @apply tw-w-full tw-block;
    opacity: 1;
  }
}
</style>

<template>
  <div :class="['window', selected == value ? 'active' : '']">
    <slot></slot>
  </div>
</template>
