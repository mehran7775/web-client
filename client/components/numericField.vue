<script setup lang="ts">
import { useAsrTrader } from "~/composables";

const props = defineProps<{ value: number }>();

const appManager = useAsrTrader();
const formatter = appManager.formatter;
defineExpose({
  formatter,
});
</script>

<style lang="postcss" scoped>
.value {
  font-size: var(--value-font-size);
  font-weight: 500;
}
</style>

<template>
  <span class="tw-whitespace-nowrap value" dir="ltr">
    {{ formatter.format(value) }}
    <slot />
  </span>
</template>
