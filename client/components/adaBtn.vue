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
    bordered: boolean | string;
    color: string;
  }>(),
  {
    color: undefined,
    width: undefined,
    height: undefined,
    type: "button",
    icon: false,
    dark: false,
    bordered: false,
  }
);
const emit = defineEmits(["click"]);

const value: Ref<any> = inject("toggle-ref", ref(null));
function click() {
  value.value = props.model;
}

const colorVal = computed(() => {
  if (props.bordered) return "rgba(0,0,0,0)"
  if (props.color) {
    let tmp = props.color.split(" ");
    if (tmp.length == 1) return "var(--c-" + tmp[0] + "-rgb)";
    else return "rgba(var(--c-" + tmp[0] + "), " + tmp[1] + ")";
  }
  return undefined;
});
const borderVal = computed(() => {
  if (typeof props.bordered === "string") return props.bordered;
  const b = "solid var(--border-size-btn) ";
  if (props.bordered) {
    if (props.color) {
      let tmp = props.color.split(" ");
      if (tmp.length == 1) return b + "var(--c-" + tmp[0] + "-rgb)";
      else return b + "rgba(var(--c-" + tmp[0] + "), " + tmp[1] + ")";
    }
    else {
      return b + " var(--c-default-rgb)"
    }
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
  <button v-ada-ripple v-bind="$attrs" v-on="$listeners" @click="
    () => {
      click();
    }
  " :class="[
  dark ? 'dark' : '',
  typeof props.model != 'undefined' && props.model == value ? 'active' : '',
]" :type="type" :style="{
  border: borderVal,
  backgroundColor: colorVal,
  minWidth: widthVal,
  maxWidth: widthVal,
  minHeight: heightVal,
  maxHeight: heightVal,
  lineHeight: icon ? '0.8334rem' : heightVal,
}">
    <slot></slot>
  </button>
</template>
