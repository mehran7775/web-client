<script setup lang="ts">
import { computed, useSlots } from "#app";
const props = withDefaults(
  defineProps<{
    ico: string;
    color: string | null;
    size: string | number;
  }>(),
  {
    ico: "mdi-icon",
    color: null,
    size: "1rem",
  }
);

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
  <i :class="['icon', group, icon]" :style="{ color: colorVar, fontSize }" v-bind="$attrs" v-on="$listeners" />
</template>
