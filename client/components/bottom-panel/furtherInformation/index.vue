<script lang="ts">
import { defineComponent, computed, ComputedRef } from "@vue/composition-api";
import template1 from "./type1.vue";
import { Message } from "@/types";
import { useBottomPanel } from "@/composables";

export default defineComponent({
  components: {
    template1,
  },
  setup(_) {
    const bottomPanel = useBottomPanel();
    const message: ComputedRef<Message> = computed(() => bottomPanel.further_information);

    return {
      message,
    };
  },
});
</script>

<template>
  <template-1 :message="message" v-if="message.type == 1" />
</template>
