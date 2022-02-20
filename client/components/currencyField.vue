<template>
  <span class="text-no-wrap value" dir="ltr">
    {{ formatter.format(value) }}
    <slot />
  </span>
</template>

<script lang="ts">
import { computed, defineComponent, useStore } from "@nuxtjs/composition-api";
import { useAsrTrader } from "~/composables";

export default defineComponent({
  props: { value: Number },
  setup() {
    const store = useStore();
    const appManager = useAsrTrader(store);
    const formatter = computed(() => appManager.currencyFormatter.value());
    return {
      formatter,
    };
  },
});
</script>
<style lang="sass" scoped>
.value
  font-size: $value-font-size
</style>
