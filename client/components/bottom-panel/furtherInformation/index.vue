<template>
  <template-1 :message="message" v-if="message.messageType == 1" />
</template>

<script lang="ts">
import {
  defineComponent,
  useStore,
  computed,
  ComputedRef,
} from "@nuxtjs/composition-api";
import template1 from "./type1.vue";
import { Tabs, Message } from "@/types";

export default defineComponent({
  components: {
    template1,
  },
  setup(params) {
    const store = useStore();
    const message: ComputedRef<Message> = computed(
      () => (store.getters["bottom-panel/further_information"] as Message)
    );

    return {
      message,
    };
  },
});
</script>
