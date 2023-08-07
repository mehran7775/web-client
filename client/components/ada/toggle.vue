<script setup lang="ts">
import { provide, ref, watch } from "vue";
const props = withDefaults(
  defineProps<{
    modelValue?: any;
    vertical?: boolean;
  }>(),
  {
    modelValue: null,
    vertical: false,
  }
);
const emit = defineEmits(["update:modelValue"]);
const val = ref(props.modelValue);

provide("toggle-ref", val);

watch(
  () => props.modelValue,
  (update) => {
    val.value = update;
  }
);

watch(val, (update) => {
  emit("update:modelValue", update);
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
