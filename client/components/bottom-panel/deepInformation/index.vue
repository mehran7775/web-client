<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-row dense>
      <v-col v-if="initData">
        <teammates
          v-if="initData.type == DeepOptions.teammates"
          v-model="initData.data"
        />
      </v-col>
      <v-col v-else>
        <h3>else</h3>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import { DeepOptions } from "@/types";
import Teammates from "./sameSector.vue";
import { useBottomPanel } from "@/composables";

export default defineComponent({
  name: "deep-information",
  components: { Teammates },
  setup(_, context) {
    const i18n = useI18n();
    const bottomPanel = useBottomPanel();
    const initData = computed(() => bottomPanel.market_depth);

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
