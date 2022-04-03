<template>
  <span class="text-no-wrap value" dir="ltr">
    {{ formatter.format(value) }}
    <slot />
  </span>
</template>

<script lang="ts">
import { defineComponent } from "#app";
import { useAsrTrader } from "~/composables";

export default defineComponent({
  props: { value: Number },
  setup() {
    const appManager = useAsrTrader();
    const formatter = appManager.percentFormatter;
    return {
      formatter,
    };
  },
});
</script>
<style lang="postcss" scoped>
.value {
  font-size: var(--value-font-size);
}
</style>
