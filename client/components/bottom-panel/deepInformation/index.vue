<template>
  <h1>deep information</h1>
</template>

<script lang="ts">
import { defineComponent, useStore } from "@nuxtjs/composition-api";

export default defineComponent({
  setup(params, context) {
    const store = useStore();
    const i18n = useI18n();

    store.commit("bottom-panel/setTitle", i18n.t("bottom-panel.depth"));

    return {};
    //TODO remove in vue3
    function useI18n() {
      return context.root.$i18n;
    }
  },
});
</script>

