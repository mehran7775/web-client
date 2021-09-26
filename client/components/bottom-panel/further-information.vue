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
import template1 from "./further-info-type1.vue";
import { Tabs } from "@/types/panels";
import { Message } from "@/types/message";

export default defineComponent({
  components: {
    template1,
  },
  setup(params) {
    const store = useStore();
    const instance = getCurrentInstance();
    const message = computed(() => {
      const message = store.getters["bottom-panel/further_information"];
      store.commit("bottom-panel/setTitle", message.origin);
      return message;
    });

    return {
      message,
    };
  },
});
</script>
