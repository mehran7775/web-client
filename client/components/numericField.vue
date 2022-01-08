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

export default defineComponent({
  props: { value: Number },
  setup() {
    const store = useStore();
    const formatter: ComputedRef<Intl.NumberFormat> = computed(
      () => store.getters["formatter"] as Intl.NumberFormat
    );
    return {
      formatter,
    };
  },
});
</script>
