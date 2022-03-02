<script setup lang="ts">
import { ref } from "@nuxtjs/composition-api";
const value = ref<string | null>(null);
const props = defineProps<{
  label: string;
  type: string;
}>();
</script>

<template>
  <label class="ada-input tw-flex tw-whitespace-nowrap">
    <div class="label">
      {{ label }}
    </div>
    <div class="input-container tw-min-w-0 tw-flex">
      <slot name="prepend"> </slot>
      <input :type="type" class="tw-min-w-0 tw-inline" v-model="value" />
      <slot name="append"></slot>
    </div>
  </label>
</template>

<style lang="postcss" scoped>
.ada-input {
  border-radius: var(--border-radius-input);
  .input-container {
    background-color: rgba(var(--c-primary), 0.1);
    border-radius: var(--border-radius-input);
  }
  input {
    border-radius: var(--border-radius-input);
  }
}
</style>
