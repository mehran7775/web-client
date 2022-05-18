<script setup lang="ts">
import { useNuxtApp, computed } from "#app";
import { Tabs } from "@/types";
import furtherInformation from "./furtherInformation/index.vue";
import DefaultOrderList from "./defaultOrderList.vue";
import DeepInformation from "./deepInformation/index.vue";
import Bests from "./bests.vue";
import { useBottomPanel } from "~/composables";
import AdaToggle from "../adaToggle.vue";
import AdaBtn from "../adaBtn.vue";

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
  console.log("toggle");
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
  position: fixed;
  bottom: 32px;
  background-color: white;

  &.expanded {
    transition: height 0.5s ease-in-out;
    height: calc(100vh - 74px);
  }

  .header {
    @apply tw-flex tw-flex-grow tw-w-full;
    box-shadow: 0 0 12px 0 rgba(53, 84, 209, 0.05);
    align-items: center;
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
    height: calc(100% - 32px);
    overflow-y: auto;
  }

  .tabs {
    @apply tw-justify-start tw-w-full;
    background-color: rgba(var(--c-default), 0.2);
    box-shadow: 0 0 1px 0 #e2e2e2;

    .tab {
      @apply tw-px-2;
      background-color: rgba(0, 0, 0, 0);
      border-radius: 0 !important;
    }
  }

  &.half {
    transition: height 0.5s ease-in-out;
    height: calc(100vh - 436px);
  }

  &.hiden {
    height: 32px;
  }
}
</style>

<template>
  <footer :class="{
    footer: true,
    expanded: expanded && tab != -1,
    half: tab != -1 && !expanded,
    hiden: tab == -1,
  }">
    <div v-show="tab != -1" class="detail">
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
      <loading :loading="showLoading" />
    </div>
    <ada-toggle class="tabs" v-model="tab" :height="32" optional>
      <ada-btn class="tab" v-for="(t, i) in tabs" :key="t" :model="i">
        {{ $t(t) }}
        <bar v-if="i < tabs.length - 1" />
      </ada-btn>
    </ada-toggle>
  </footer>
</template>
