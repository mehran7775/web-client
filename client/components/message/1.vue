<script setup lang="ts">
const props = defineProps<{
  modelValue: { [key: string]: any };
}>();
</script>

<style lang="postcss" scoped>
p {
  @apply tw-p-5 tw-text-justify;
}
</style>

<template>
  <p v-text="modelValue['body']"></p>
</template>
