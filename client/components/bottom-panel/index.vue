<script setup lang="ts">
import { useNuxtApp, computed } from "#app";
import { Tabs } from "@/types";
import furtherInformation from "./furtherInformation/index.vue";
import DefaultOrderList from "./defaultOrderList.vue";
import DeepInformation from "./deepInformation/index.vue";
import Bests from "./bests.vue";
import { useBottomPanel } from "~/composables";

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
      footer: true,
      expanded: expanded,
      half: tab != -1 && !expanded,
      hiden: tab == -1,
    }"
  >
    <header class="header" v-if="tab != -1">
      <h4>
        {{ title }}
      </h4>
      <ada-spacer />
      <v-btn icon @click="expand()">
        <v-icon size="1em"> {{ icon }}</v-icon>
      </v-btn>
      <v-btn icon @click="close()">
        <v-icon size="1em">mdi-minus</v-icon>
      </v-btn>
    </header>
    <div v-if="tab != -1" class="detail">
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
    </div>
    <v-tabs v-model="tab" :height="32" optional>
      <v-tab v-for="t in tabs" :key="t">
        {{ $t(t) }}
      </v-tab>
    </v-tabs>
  </footer>
</template>

<style lang="postcss" scoped>
.footer {
  @apply tw-flex tw-flex-col tw-flex-grow;
  width: calc(100% - 96px);
  position: fixed;
  bottom: 32px;
  background-color: var(--c-default-db-rgb);
  .expanded {
    transition: all 0.5s ease-in-out;
    height: 100%;
  }
  .header {
    @apply tw-flex tw-flex-grow tw-w-full;
    align-items: center;
    position: relative;
    height: 32px;
    color: var(--c-primary-rgb);
    background-color: rgba(var(--c-primary), 0.05);
    padding: 0 12px;
  }
  .detail {
    position: relative;
    width: 100%;
    font-size: 1rem;
    line-height: 1.5;
    height: calc(100% - 64px);
    overflow-y: auto;
  }
}

.half {
  transition: all 0.5s ease-in-out;
  height: calc(100vh - 436px);
}

.hiden {
  height: 32px;
}
</style>
