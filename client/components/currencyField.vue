<script setup lang="ts">
import { useAsrTrader } from "~/composables";

const props = withDefaults(defineProps<{ value?: number }>(), { value: 0 });

const appManager = useAsrTrader();
const formatter = appManager.currencyFormatter;
defineExpose({
  formatter,
});
</script>
<style lang="postcss" scoped>
.value {
  font-size: var(--value-font-size);
}
</style>

<template>
  <span class="text-no-wrap value" dir="ltr">
    {{ formatter.format(value) }}
    <slot />
  </span>
</template>
