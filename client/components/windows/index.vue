<script setup lang="ts"></script>
<style scoped lang="postcss">
.windows {
  @apply tw-relative tw-flex tw-flex-grow;
  max-width: 100%;
  display: flex;
  flex-direction: row;
}
</style>
<template>
  <div class="windows">
    <slot></slot>
  </div>
</template>
