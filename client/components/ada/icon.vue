<script setup lang="ts">
import { computed, useSlots } from "vue";
const props = withDefaults(
  defineProps<{
    ico?: string;
    size?: string | number;
    clickPointer?: string;
    disabled?: string | boolean;
  }>(),
  {
    ico: "mdi-icon",
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
  if (slots.default) {
    switch (typeof slots.default()[0].children) {
      case "string":
        return (slots.default()[0].children as string)!.trim();
    }
    return props.ico;
  }
});
const group = computed(() => icon.value?.split("-")[0]);
const fontSize = computed(() =>
  typeof props.size === "string" ? props.size : props.size + "px"
);
</script>

<style lang="postcss" scoped>
:disabled .icon,
[disabled] {
  @apply tw-text-gray-400;
}
/* .icon:disabled {
  @apply tw-text-gray-400;
} */

.icon {
  @apply tw-inline-flex tw-items-center tw-justify-center tw-relative tw-align-middle tw-select-none tw-text-gray3;
  font-feature-settings: "liga";
  letter-spacing: normal;
  line-height: 1;
  text-indent: 0;
}
</style>

<template>
  <i class="icon" :class="[group, icon]"
    :style="{ fontSize, cursor: ($attrs && $attrs['click'] && !disabled) ? clickPointer : 'unset' }"
    :disabled="disabled" v-bind="$attrs" @click="click" :key="icon"></i>
</template>
