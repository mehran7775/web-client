<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-row dense>
      <v-col>
        <teammates
          v-if="initData.type == DeepOptions.teammates"
          v-model="initData.data"
        />
        <h3 v-else>else</h3>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent, useStore } from "@nuxtjs/composition-api";
import { DeepOptions } from "@/types";
import Teammates from "./teammates.vue";

export default defineComponent({
  name: "deep-information",
  components: { Teammates },
  setup(params, context) {
    const store = useStore();
    const i18n = useI18n();
    const initData = computed(() => store.getters["bottom-panel/market_depth"]);

    return {
      initData,
      DeepOptions,
    };
    //TODO remove in vue3
    function useI18n() {
      return context.root.$i18n;
    }
  },
});
</script>

