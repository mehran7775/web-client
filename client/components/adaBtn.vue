<script setup lang="ts">
import { computed, inject, ref, Ref } from "#app";
const props = withDefaults(
  defineProps<{
    model?: any;
    width: number | string;
    height: number | string;
    type: "button" | "submit" | "reset";
    icon: boolean;
    dark: boolean;
    color: string;
  }>(),
  {
    color: undefined,
    width: undefined,
    height: undefined,
    type: "button",
    icon: false,
    dark: false,
  }
);
const emit = defineEmits(["click"]);

const value: Ref<any> = inject("toggle-ref", ref(null));
function click() {
  value.value = props.model;
}

const colorVal = computed(() => {
  if (props.color) {
    let tmp = props.color.split(" ");
    if (tmp.length == 1) return "var(--c-" + tmp[0] + "-rgb)";
    else return "rgba(var(--c-" + tmp[0] + "), " + tmp[1] + ")";
  }
  return undefined;
});
const widthVal = computed(() =>
  typeof props.width === "number" ? props.width.toString() + "px" : props.width
);
const heightVal = computed(() =>
  typeof props.height === "number" ? props.height.toString() + "px" : props.height
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
  &.active::after {
    content: "";
    background-color: rgba(var(--c-primary), 0.2);
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
  }
}
</style>

<template>
  <button
    v-ripple
    v-bind="$attrs"
    v-on="$listeners"
    @click="
      () => {
        click();
      }
    "
    :class="[
      dark ? 'dark' : '',
      typeof props.model != 'undefined' && props.model == value ? 'active' : '',
    ]"
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
