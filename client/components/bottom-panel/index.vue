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

<style lang="postcss" scoped>
.footer {
  @apply tw-flex tw-flex-col tw-flex-grow;
  width: calc(100% - 96px);
  position: fixed;
  bottom: 32px;
  background-color: white;
  &.expanded {
    transition: all 0.5s ease-in-out;
    height: calc(100vh - 74px);
  }
  .header {
    @apply tw-flex tw-flex-grow tw-w-full;
    box-shadow: 0 0 12px 0 rgba(53, 84, 209, 0.05);
    align-items: center;
    position: absolute;
    height: 32px;
    color: var(--c-primary-rgb);
    background-color: rgba(var(--c-primary), 0.05);
    padding: 0 12px;
    top: 0;
    left: 0;
  }
  .detail {
    position: relative;
    width: 100%;
    font-size: 1rem;
    line-height: 1.5;
    height: calc(100% - 64px);
    overflow-y: auto;
    margin-top: 32px;
  }
  .tabs {
    background-color: rgba(var(--c-default), 0.2);
    box-shadow: 0 0 1px 0 #e2e2e2;
  }
  &.half {
    transition: all 0.5s ease-in-out;
    height: calc(100vh - 436px);
  }

  &.hiden {
    height: 32px;
  }
}
</style>

<template>
  <footer
    :class="{
      footer: true,
      expanded: expanded && tab != -1,
      half: tab != -1 && !expanded,
      hiden: tab == -1,
    }"
  >
    <div v-show="tab != -1" class="detail">
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
    <header class="header" v-show="tab != -1">
      <h4>
        {{ title }}
      </h4>
      <ada-spacer />
      <ada-btn class="tw-mx-[5px]" :width="24" :height="24" @click="expand()">
        <ada-icon color="primary" :size="16"> isax-maximize-3 </ada-icon>
      </ada-btn>
      <ada-btn color="primary" :width="24" :height="24" @click="close()">
        <ada-icon :size="16">isax-minus</ada-icon>
      </ada-btn>
    </header>
    <v-tabs class="tabs" v-model="tab" :height="32" optional>
      <v-tab v-for="t in tabs" :key="t">
        {{ $t(t) }}
      </v-tab>
    </v-tabs>
  </footer>
</template>
