<template>
  <template-1 :message="message" v-if="message.messageType == 1" />
</template>

<script lang="ts">
import { defineComponent, computed, ComputedRef } from "@vue/composition-api";
import template1 from "./type1.vue";
import { Tabs, Message } from "@/types";
import { useNuxtApp } from "#app";

export default defineComponent({
  components: {
    template1,
  },
  setup(params) {
    const { $store: store } = useNuxtApp();
    const message: ComputedRef<Message> = computed(
      () => store.getters["bottom-panel/further_information"] as Message
    );

    return {
      message,
    };
  },
});
</script>
