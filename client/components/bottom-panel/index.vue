<template>
  <v-footer :absolute="true" :class="{ expanded: expanded }" class="ma-0 pa-0">
    <v-card :class="{ expanded: expanded }" width="100%" elevation="1">
      <v-card-title v-if="tab != -1">
        <h4 class="font-weight-bold pt-1">
          {{ title }}
        </h4>
        <v-spacer />
        <v-btn icon @click="expand()">
          <v-icon size="1em"> {{ icon }}</v-icon>
        </v-btn>
        <v-btn icon @click="close()">
          <v-icon size="1em">mdi-minus</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider class="mt-4 px-0 mx-1"></v-divider>
      <v-tabs-items v-model="tab" :class="{ expanded: expanded }">
        <v-tab-item>
          <default-order-list />
        </v-tab-item>
        <v-tab-item>
          <bests />
        </v-tab-item>
        <v-tab-item>
          <deep-information />
        </v-tab-item>
        <v-tab-item>
          <further-information />
        </v-tab-item>
      </v-tabs-items>
      <v-card-actions>
        <v-tabs v-model="tab" optional >
          <v-tab>
            {{ $t("bottom-panel.orders") }}
          </v-tab>
          <v-tab>
            {{ $t("bottom-panel.bests") }}
          </v-tab>
          <v-tab>
            {{ $t("bottom-panel.depth") }}
          </v-tab>
          <v-tab>
            {{ $t("bottom-panel.more") }}
          </v-tab>
        </v-tabs>
      </v-card-actions>
    </v-card>
  </v-footer>
</template>

<script lang="ts">
import { defineComponent, useStore, computed } from "@nuxtjs/composition-api";
import furtherInformation from "./further-information.vue";
import { Tabs } from "@/types/panels";
import DefaultOrderList from "./defaultOrderList.vue";
import DeepInformation from "./deepInformation.vue";
import Bests from "./bests.vue";

//TODO not working on small displays

export default defineComponent({
  components: { furtherInformation, DeepInformation, DefaultOrderList, Bests },
  setup() {
    const store = useStore();
    const tab = computed({
      get(): Tabs {
        return store.getters["bottom-panel/activeTab"] as Tabs;
      },
      set(value: Tabs) {
        store.commit("bottom-panel/setActiveTab", value);
        store.dispatch("bottom-panel/getMessage", 1);
      },
    });
    const expand = () => {
      store.commit("bottom-panel/toggleExpand");
    };
    const close = () => {
      if (expanded.value) store.commit("bottom-panel/toggleExpand");
      store.commit("bottom-panel/setActiveTab", Tabs.none);
    };
    const icon = computed(() =>
      store.getters["bottom-panel/expanded"]
        ? "mdi-arrow-collapse"
        : "mdi-arrow-expand"
    );
    const expanded = computed(() => store.getters["bottom-panel/expanded"]);
    const title = computed(() => store.getters["bottom-panel/title"]);
    return {
      expand,
      close,
      icon,
      tab,
      title,
      expanded,
    };
  },
});
</script>

<style scoped>
.expanded {
  height: 100%;
}
</style>
