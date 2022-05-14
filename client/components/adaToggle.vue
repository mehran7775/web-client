<script setup lang="ts">
import { provide, ref, watch } from "#app";
const props = withDefaults(
  defineProps<{
    value: any;
  }>(),
  {
    value: 0,
  }
);
const val = ref(props.value);
provide("toggle-ref", val);

watch(
  () => props.value,
  (update) => {
    val.value = update;
  }
);
</script>
<style lang="postcss">
.toggle {
  @apply tw-flex tw-flex-nowrap tw-flex-grow;
}
</style>
<template>
  <div class="toggle">
    <slot />
  </div>
</template>
