<script setup lang="ts">
import { computed, useSlots } from "#app";
const props = withDefaults(
  defineProps<{
    ico?: string;
    color?: string | null;
    size?: string | number;
    clickPointer?: string;
    disabled?: string | boolean;
  }>(),
  {
    ico: "mdi-icon",
    color: null,
    size: "1rem",
    clickPointer: 'pointer',
    disabled: false
  }
);

const emit = defineEmits(['click'])

function click(ev: Event) {
  if (!props.disabled)
    emit('click', ev)
}

const slots = useSlots();
var icon = computed(() => {
  if (slots.default) return slots.default()[0].text!.trim();
  return props.ico;
});
const group = computed(() => icon.value.split("-")[0]);
const colorVar = computed(() => props.color ? "var(--c-" + props.color + "-rgb)" : "inherit");
const fontSize = computed(() =>
  typeof props.size === "string" ? props.size : props.size + "px"
);
</script>

<style lang="postcss" scoped>
:disabled .icon,
[disabled] {
  color: var(--c-gray-rgb) !important;
}

.icon {
  align-items: center;
  display: inline-flex;
  font-feature-settings: "liga";
  justify-content: center;
  letter-spacing: normal;
  line-height: 1;
  position: relative;
  text-indent: 0;
  vertical-align: middle;
  user-select: none;

}
</style>

<template>
  <i class="icon" :class="[group, icon]"
    :style="{ color: colorVar, fontSize, cursor: ($listeners && $listeners['click'] && !disabled) ? clickPointer : 'unset' }"
    :disabled="disabled" v-bind="$attrs" @click="click" :key="icon" />
</template>
