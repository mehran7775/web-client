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
  <div class="tw-container tw-mx-auto">
    <div class="tw-grid w-grid-cols-1">
      <div class="tw-col-span-1" v-if="initData">
        <teammates v-if="initData.type == DeepOptions.teammates" v-model="initData.data" />
      </div>
      <div class="tw-col-span-1" v-else>
        <h3>else</h3>
      </div>
    </div>
  </div>
</template>
