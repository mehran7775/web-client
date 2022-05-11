<script setup lang="ts">
import { computed } from "#app";
const props = withDefaults(
  defineProps<{
    width: number | string;
    height: number | string;
    type: "button" | "submit" | "reset";
    icon: boolean;
    dark: boolean;
    color: string;
  }>(),
  {
    color: "primary",
    width: "50px",
    height: "32px",
    type: "button",
    icon: false,
    dark: false,
  }
);

const colorVal = computed(() => {
  let tmp = props.color.split(" ");
  if (tmp.length == 1) return "var(--c-" + tmp[0] + "-rgb)";
  else return "rgba(var(--c-" + tmp[0] + "), " + tmp[1] + ")";
});
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
  &.dark {
    color: white;
  }
}
</style>

<template>
  <button
    v-bind="$attrs"
    v-on="$listeners"
    :class="[dark ? 'dark' : '']"
    :type="type"
    :style="{
      backgroundColor: colorVal,
      minWidth: widthVal,
      maxWidth: widthVal,
      minHeight: heightVal,
      maxHeight: heightVal,
      lineHeight: icon ? '0.8334rem' : heightVal,
    }"
  >
    <slot></slot>
  </button>
</template>
