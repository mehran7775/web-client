<template>
  <v-footer
    :absolute="true"
    :class="{
      expanded: expanded,
      half: tab != -1 && !expanded,
    }"
    class="ma-0 pa-0"
  >
    <v-card :class="{ expanded: true }" width="100%">
      <v-toolbar v-if="tab != -1" elevation="1" dense>
        <v-card-title>
          {{ $t(title) }}
        </v-card-title>
        <v-spacer />
        <v-btn icon @click="expand()">
          <v-icon size="1em"> {{ icon }}</v-icon>
        </v-btn>
        <v-btn icon @click="close()">
          <v-icon size="1em">mdi-minus</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text v-if="tab != -1" class="detail">
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
      </v-card-text>
      <v-card-actions height="48" class="ma-0 pa-0">
        <v-tabs v-model="tab" optional>
          <v-tab v-for="t in tabs" :key="t">
            {{ $t(t) }}
          </v-tab>
        </v-tabs>
      </v-card-actions>
    </v-card>
  </v-footer>
</template>

<script lang="ts">
import { defineComponent, useStore, computed } from "@nuxtjs/composition-api";
import furtherInformation from "./furtherInformation/index.vue";
import { Tabs } from "@/types/panels";
import DefaultOrderList from "./defaultOrderList.vue";
import DeepInformation from "./deepInformation/index.vue";
import Bests from "./bests.vue";

//TODO not working on small displays

export default defineComponent({
  components: { furtherInformation, DeepInformation, DefaultOrderList, Bests },
  setup(props, context) {
    const store = useStore();
    const i18n = useI18n();
    const tabs = [
      "bottom-panel.orders",
      "bottom-panel.bests",
      "bottom-panel.depth",
      "bottom-panel.more",
    ];
    const tab = computed({
      get(): Tabs {
        return store.getters["bottom-panel/activeTab"] as Tabs;
      },
      set(value: Tabs) {
        store.commit("bottom-panel/setActiveTab", value);
      },
    });
    const icon = computed(() =>
      store.getters["bottom-panel/expanded"]
        ? "mdi-arrow-collapse"
        : "mdi-arrow-expand"
    );
    const expanded = computed(() => store.getters["bottom-panel/expanded"]);
    const title = computed(() => store.getters["bottom-panel/title"]);

    function expand() {
      store.commit("bottom-panel/toggleExpand");
    }
    function close() {
      if (expanded.value) store.commit("bottom-panel/toggleExpand");
      store.commit("bottom-panel/setActiveTab", Tabs.none);
    }

    return {
      expand,
      close,
      icon,
      tab,
      tabs,
      title,
      expanded,
    };
    function useI18n() {
      return context.root.$i18n;
    }
  },
});
</script>

<style scoped>
.expanded {
  height: 100%;
}
.half {
  height: calc(40vh - 96px);
}
.detail{
  font-size: 1rem; 
  line-height: 1.5;
  height: calc(100% - 96px);
}
</style>
