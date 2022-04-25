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
  @apply tw-hidden tw-flex-grow;
  min-width: 0;
  &.active {
    @apply tw-flex;
    opacity: 1;
  }
}
</style>

<template>
  <div :class="['window', selected == value ? 'active' : '']">
    <slot></slot>
  </div>
</template>
