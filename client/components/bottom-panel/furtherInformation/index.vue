<template>
  <template-1 :message="message" v-if="message.type == 1" />
</template>

<script>
import {
  defineComponent,
  useStore,
  computed,
  getCurrentInstance,
} from "@nuxtjs/composition-api";
import template1 from "./type1.vue";
import { Tabs, Message } from "@/types";

export default defineComponent({
  components: {
    template1,
  },
  setup(params) {
    const store = useStore();
    const message = computed(
      () => store.getters["bottom-panel/further_information"]
    );

    return {
      message,
    };
  },
});
</script>
