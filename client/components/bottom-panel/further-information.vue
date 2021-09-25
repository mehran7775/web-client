<template>
  <v-card :height="height" width="100%" class="white" elevation="1">
    <div class="px-2 py-6">
      <v-row class="px-4" justify="space-between">
        <h4 class="font-weight-bold pt-1">
          {{ $t(`oms.message.origin.${message.origin}`) }}
        </h4>
        <v-spacer/>
        <v-btn icon @click="expand()">
          <v-icon size="1em"> {{ icon }}</v-icon>
        </v-btn>
        <v-btn icon @click="close()">
          <v-icon size="1em">mdi-minus</v-icon>
        </v-btn>
      </v-row>
      <v-divider class="mt-4 px-0 mx-1"></v-divider>
      <template-1 :message="message" v-if="message.type == 1" />
    </div>
  </v-card>
</template>

<script>
import { defineComponent, useStore, computed } from "@nuxtjs/composition-api";
import template1 from "./further-info-type1.vue";
import { Tabs } from "@/types/panels";

export default defineComponent({
  components: {
    template1,
  },
  setup() {
    const store = useStore();
    const expand = () => {
      store.commit("bottom-panel/toggleExpand");
    };
    const close = () => {
      store.commit("bottom-panel/setActiveTab", Tabs.none);
    };
    const icon = computed(() => store.getters["bottom-panel/icon"]);
    const height = computed(() =>
      store.getters["bottom-panel/expanded"] ? "100%" : "auto"
    );
    const message = computed(
      () => store.getters["bottom-panel/further_information"]
    );

    return {
      icon,
      height,
      message,
      expand,
      close,
    };
  },
});
</script>
