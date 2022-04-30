<script setup lang="ts">
import { computed } from "#app";
const props = withDefaults(
  defineProps<{
    width: number | string;
    height: number | string;
    type: "button" | "submit" | "reset";
    icon: boolean;
  }>(),
  {
    width: "auto",
    height: "auto",
    type: "button",
    icon: false,
  }
);

const widthVal = computed(() =>
  typeof props.width === "string" ? props.width : props.width.toString() + "px"
);
const heightVal = computed(() =>
  typeof props.height === "string" ? props.height : props.height.toString() + "px"
);
</script>

<style lang="postcss" scoped>
button {
  @apply tw-min-w-0 tw-justify-center;
  background-color: rgba(var(--c-primary), 0.1);
  border-radius: var(--border-radius-root);
  font-size: 0.8334rem;
  font-weight: bold;
  position: relative;
  overflow: hidden;
}
</style>

<template>
  <button
    v-bind="$attrs"
    v-on="$listeners"
    :type="type"
    :style="{
      minWidth: widthVal,
      maxWidth: widthVal,
      minHeight: heightVal,
      maxHeight: heightVal,
      lineHeight: icon ? '0.8334rem' : '',
    }"
  >
    <slot></slot>
  </button>
</template>
