<template>
  <span>
    {{ formatter.format(value) }}
  </span>
</template>

<script lang="ts">
import {
  defineComponent,
  useStore,
  ComputedRef,
  computed,
} from "@nuxtjs/composition-api";
import { useAsrTrader } from "~/composables";

export default defineComponent({
  props: { value: Number },
  setup() {
    const store = useStore();
    const appManager = useAsrTrader(store);
    const formatter = appManager.formatter;
    return {
      formatter,
    };
  },
});
</script>
