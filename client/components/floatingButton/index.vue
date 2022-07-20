<script setup lang="ts">

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
    <slot></slot>
  </ada-btn>
</template>
