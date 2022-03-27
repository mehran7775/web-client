<template>
  <span class="text-no-wrap value" dir="ltr">
    {{ formatter.format(value) }}
    <slot />
  </span>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { useAsrTrader } from "~/composables";
import { useNuxtApp } from "#app";

export default defineComponent({
  props: { value: Number },
  setup() {
    const { $store: store } = useNuxtApp();
    const appManager = useAsrTrader(store);
    const formatter = appManager.formatter;
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
