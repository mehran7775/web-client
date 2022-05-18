<script setup lang="ts">
import { computed } from "#app";
import { DeepOptions } from "@/types";
import Teammates from "./sameSector.vue";
import { useBottomPanel } from "@/composables";

const bottomPanel = useBottomPanel();
const initData = computed(() => bottomPanel.market_depth);

defineExpose({
  initData,
  DeepOptions,
});
</script>

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
