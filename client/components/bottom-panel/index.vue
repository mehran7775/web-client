<template>
  <v-container fluid>
    <v-col class="ma-0 pa-0">
      <v-row class="ma-1" v-if="tab == 4">
        <further-information />
      </v-row>
      <v-row class="white">
        <v-btn-toggle v-model="tab" borderless dense color="blue">
          <v-btn :value="1" width="7rem" class="white"> سفارشات </v-btn>

          <v-btn :value="2" width="7rem" class="white"> برترین ها </v-btn>

          <v-btn :value="3" width="7rem" class="white"> عمق بازار </v-btn>

          <v-btn :value="4" width="7rem" class="white"> اطلاعات تکمیلی </v-btn>
        </v-btn-toggle>
      </v-row>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, useStore, computed } from "@nuxtjs/composition-api";
import furtherInformation from "./further-information.vue";
import { Tabs } from "@/types/panels"

export default defineComponent({
  components: { furtherInformation },
  setup() {
    const store = useStore();
    const tab = computed({
      get() : Tabs {
        return store.getters["bottom-panel/activeTab"] as Tabs;
      },
      set(value: Tabs) {
        store.commit("bottom-panel/setActiveTab", value);
        store.dispatch("bottom-panel/getMessage", 1);
      },
    });
    return {
      tab,
    };
  },
});
</script>
