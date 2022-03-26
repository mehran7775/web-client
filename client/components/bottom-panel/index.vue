<template>
  <v-footer
    :class="{
      'ma-0 pa-0': true,
      expanded: expanded,
      half: tab != -1 && !expanded,
      hiden: tab == -1,
    }"
  >
    <v-card :class="{ expanded: true }" width="100%">
      <v-toolbar
        :height="height"
        color="primary"
        v-if="tab != -1"
        elevation="1"
        dark
        dense
      >
        <v-card-title>
          {{ title }}
        </v-card-title>
        <v-spacer />
        <v-btn icon @click="expand()">
          <v-icon size="1em"> {{ icon }}</v-icon>
        </v-btn>
        <v-btn icon @click="close()">
          <v-icon size="1em">mdi-minus</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text v-if="tab != -1" class="detail ma-0 pa-0">
        <loading :loading="loading" />
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

      <v-card-actions :height="height" class="ma-0 pa-0">
        <v-tabs v-model="tab" :height="height" optional>
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
import { Tabs, TabTitle } from "@/types";
import furtherInformation from "./furtherInformation/index.vue";
import DefaultOrderList from "./defaultOrderList.vue";
import DeepInformation from "./deepInformation/index.vue";
import Bests from "./bests.vue";
import { useUser } from "~/composables";

//TODO not working on small displays

export default defineComponent({
  components: { furtherInformation, DeepInformation, DefaultOrderList, Bests },
  setup(props, context) {
    const store = useStore();
    const userManager = useUser(store);
    const i18n = useI18n();
    const tabs = ["bottom-panel.orders", "bottom-panel.bests", "bottom-panel.depth"];
    const isLogin = userManager.isLogin;
    const tab = computed({
      get(): Tabs {
        return store.getters["bottom-panel/activeTab"] as Tabs;
      },
      set(value: Tabs) {
        if (value != null) store.commit("bottom-panel/setActiveTab", value);
        else store.commit("bottom-panel/setActiveTab", Tabs.none);
      },
    });
    const icon = computed(() =>
      store.getters["bottom-panel/expanded"] ? "mdi-arrow-collapse" : "mdi-arrow-expand"
    );
    const expanded = computed(() => store.getters["bottom-panel/expanded"]);
    const loading = computed(() => store.getters["bottom-panel/loading"]);
    const title = computed(() => {
      const tab = store.getters["bottom-panel/title"] as TabTitle;
      return tab ? i18n.t(tab.title, tab.params) : "";
    });

    function expand() {
      store.commit("bottom-panel/toggleExpand");
    }
    function close() {
      if (expanded.value) store.commit("bottom-panel/toggleExpand");
      store.commit("bottom-panel/setActiveTab", Tabs.none);
    }

    return {
      height: 32,
      expand,
      close,
      icon,
      tab,
      tabs,
      title,
      expanded,
      loading,
      isLogin,
    };
    function useI18n() {
      return context.root.$i18n;
    }
  },
});
</script>

<style lang="postcss" scoped>
.expanded {
  transition: all 0.5s ease-in-out;
  height: 100%;
}

.half {
  transition: all 0.5s ease-in-out;
  height: calc(50vh - 64px);
}

.hiden {
  height: 32px;
}
.detail {
  position: relative;
  width: 100%;
  font-size: 1rem;
  line-height: 1.5;
  height: calc(100% - 64px);
  overflow-y: auto;
}
</style>
