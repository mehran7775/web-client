<template>
  <h1>bests</h1>
</template>

<script lang="ts">
import { defineComponent } from "#app";

export default defineComponent({
  setup(params, context) {
    const i18n = useI18n();

    return {};
    //TODO remove in vue3
    function useI18n() {
      return context.root.$i18n;
    }
  },
});
</script>
