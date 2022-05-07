<script setup lang="ts">
import { useNuxtApp, computed } from "#app";
import { Tabs } from "@/types";
import furtherInformation from "./furtherInformation/index.vue";
import DefaultOrderList from "./defaultOrderList.vue";
import DeepInformation from "./deepInformation/index.vue";
import Bests from "./bests.vue";
import { useBottomPanel } from "~/composables";

const height = 32;
const bottomPanel = useBottomPanel();
const { $i18n: i18n } = useNuxtApp();
const tabs = ["bottom-panel.orders", "bottom-panel.bests", "bottom-panel.depth"];
const tab = computed({
  get(): Tabs {
    return bottomPanel.activeTab;
  },
  set(value: Tabs) {
    if (value != null) bottomPanel.setActiveTab(value);
    else bottomPanel.setActiveTab(Tabs.none);
  },
});
const icon = computed(() =>
  bottomPanel.expanded ? "mdi-arrow-collapse" : "mdi-arrow-expand"
);
const expanded = computed(() => bottomPanel.expanded);
const showLoading = computed(() => bottomPanel.loading);
const title = computed(() => {
  const tab = bottomPanel.title;
  return tab ? i18n.t(tab.title, tab.params) : "";
});

function expand() {
  bottomPanel.toggleExpand();
}
function close() {
  if (expanded.value) bottomPanel.toggleExpand();
  bottomPanel.setActiveTab(Tabs.none);
}
</script>

<template>
  <footer
    :class="{
      'ma-0 pa-0': true,
      expanded: expanded,
      half: tab != -1 && !expanded,
      hiden: tab == -1,
    }"
  >
    <v-card class="tw-h-full" width="100%">
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
        <loading :loading="showLoading" />
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
  </footer>
</template>

<style lang="postcss" scoped>
.footer {
  position: fixed;
  bottom: 0;
  &.expanded {
    top: 0;
    position: absolute;
  }
}
.expanded {
  transition: all 0.5s ease-in-out;
  height: 100%;
}

.half {
  transition: all 0.5s ease-in-out;
  height: calc(100vh - 436px);
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
