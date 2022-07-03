<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    minWidth: number | string;
    width: number | string;
    maxWidth: number | string;
  }>(),
  {
    minWidth: "0",
    maxWidth: "100%",
    width: "100%",
  }
);
</script>
<template>
  <div
    v-bind="$attrs"
    v-on="$listeners"
    v-ada-ripple
    :style="{
      minWidth:
        typeof props.minWidth == 'number' ? props.minWidth + 'px' : props.minWidth,
      maxWidth:
        typeof props.maxWidth == 'number' ? props.maxWidth + 'px' : props.maxWidth,
      width: typeof props.width == 'number' ? props.width + 'px' : props.width,
    }"
  >
    <slot></slot>
  </div>
</template>
