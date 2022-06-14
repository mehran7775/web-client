<script setup lang="ts">
import { provide, ref, watch } from "#app";
const props = withDefaults(
  defineProps<{
    value: any;
    vertical: boolean;
  }>(),
  {
    value: null,
    vertical: false,
  }
);
const emit = defineEmits(["input"]);
const val = ref(props.value);
provide("toggle-ref", val);

watch(
  () => props.value,
  (update) => {
    val.value = update;
  }
);
watch(val, (update) => {
  emit("input", update);
});
</script>
<style lang="postcss">
.toggle {
  @apply tw-flex tw-flex-nowrap tw-flex-grow;

  &.vertical {
    @apply tw-flex-col;
  }
}
</style>
<template>
  <div class="toggle" :class="[vertical ? 'vertical' : '']">
    <slot />
  </div>
</template>
