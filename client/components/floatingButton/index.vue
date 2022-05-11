<script setup lang="ts">
const props = withDefaults(defineProps<{}>(), {});
</script>

<style lang="postcss">
.floating-btn {
  border-radius: 50% !important;
  z-index: 1000;
  position: absolute !important;
}
</style>

<template>
  <ada-btn class="floating-btn" v-bind="$attrs" v-on="$listeners">
    <slot />
  </ada-btn>
</template>
