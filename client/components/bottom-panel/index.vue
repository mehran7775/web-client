<script setup lang="ts">
import { ref, Ref, computed, ComputedRef } from "#app";
import { OrderFlags, OrderSearchModel, TabItem } from "@/types";
import furtherInformation from "./furtherInformation/index.vue";
import DefaultOrderList from "./defaultOrderList.vue";
import DeepInformation from "./deepInformation/index.vue";
import Bests from "./bests.vue";
import { useBottomPanel } from "~/composables";
import AdaToggle from "@/components/adaToggle.vue";
import AdaBtn from "@/components/adaBtn.vue";
import AdaTabs from "@/components/adaTabs/index.vue"
import AdaTab from "@/components/adaTabs/adaTab.vue"

const defaultItem = { title: "", params: [] };
const bottomPanel = useBottomPanel();
const active: Ref<TabItem> = ref(defaultItem)
const tabs = computed(() => bottomPanel.tabs);
const tab = computed({
  get(): TabItem {
    return bottomPanel.activeTab ?? defaultItem;
  },
  set(value: TabItem) {
    bottomPanel.setActiveTab(value);
    if (value) {
      if (value.default && value.children) {
        active.value = value.children.find((item) => item.title == value.default) || defaultItem;
      } else {
        active.value = value
      }
    } else {
      active.value = defaultItem
    }
  },
});

const searchModels = {
  draftOrders: new OrderSearchModel(0, 10, OrderFlags.Draft),
  actives: new OrderSearchModel(0, 10, OrderFlags.Confirmed | OrderFlags.PreOpening | OrderFlags.Created | OrderFlags.Sent),
  canceledOrders: new OrderSearchModel(0, 10, OrderFlags.Cancelled),
}

const expanded = computed(() => bottomPanel.expanded);
const showLoading = computed(() => bottomPanel.loading);
const headers: ComputedRef<TabItem[]> = computed(() =>
  typeof tab.value?.children != 'undefined' ? tab.value.children : [{ title: '', params: [] }]);

function expand() {
  bottomPanel.toggleExpand();
}
function close() {
  if (expanded.value) bottomPanel.toggleExpand();
  bottomPanel.setActiveTab(null);
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

  &.half {
    transition: height 0.5s ease-in-out;
    height: calc(100vh - 436px);
    min-height: 30vh;
  }

  &.hiden {
    height: 32px;
  }

  >.detail {
    position: relative;
    width: 100%;
    font-size: 1rem;
    line-height: 1.5;
    height: calc(100% - 32px);

    >.header {
      @apply tw-flex tw-flex-grow tw-w-full;
      position: absolute;
      top: 0;
      left: 0;
      box-shadow: 0 0 12px 0 rgba(53, 84, 209, 0.05);
      align-items: center;
      height: 32px;
      color: var(--c-primary-rgb);
      background-color: rgba(var(--c-primary), 0.05);
      padding: 0 12px;
      top: 0;
      left: 0;

      >.tabs {
        @apply tw-justify-start tw-w-full tw-items-end;
        color: rgb(0, 0, 0);
        background-color: rgba(var(--c-default), 0.2);
        box-shadow: 0 0 1px 0 #e2e2e2;
        height: 31px;
        border-bottom: 1px solid rgba(var(--c-primary), 0.2);

        .tab {
          @apply tw-px-2;
          background-color: rgba(0, 0, 0, 0);
          min-width: 99px;
          height: 24px;
          border-radius: var(--border-radius-root) var(--border-radius-root) 0 0;

          &::after {
            border-radius: var(--border-radius-root) var(--border-radius-root) 0 0;
          }
        }
      }

    }

    >.contents {
      @apply tw-mt-[32px];
      overflow-y: auto;
      height: calc(100% - 32px);
    }
  }

  >.tabs {
    @apply tw-justify-start tw-w-full;
    background-color: rgba(var(--c-default), 0.2);
    box-shadow: 0 0 1px 0 #e2e2e2;
    min-height: 32px;

    .tab {
      @apply tw-px-2;
      background-color: rgba(0, 0, 0, 0);
      border-radius: 0 !important;
      min-width: 99px;
    }
  }

}
</style>

<template>
  <footer :class="{
    footer: true,
    expanded: expanded && tab != defaultItem,
    half: tab != defaultItem && !expanded,
    hiden: tab == defaultItem,
  }">
    <div v-show="tab.title != ''" class="detail">
      <div class="contents">
        <ada-tabs v-model="active" name-key="$.title" class="tw-h-full" :class="{ expanded: expanded }">
          <ada-tab name="bottom-panel.orders.all">
            <default-order-list />
          </ada-tab>
          <ada-tab name="bottom-panel.orders.drafts">
            <default-order-list v-model="searchModels.draftOrders" />
          </ada-tab>
          <ada-tab name="bottom-panel.orders.actives">
            <default-order-list v-model="searchModels.actives" />
          </ada-tab>
          <ada-tab name="bottom-panel.orders.canceled">
            <default-order-list v-model="searchModels.canceledOrders" />
          </ada-tab>
          <ada-tab name="bottom-panel.bests">
            <bests />
          </ada-tab>
          <ada-tab name="bottom-panel.depth">
            <deep-information />
          </ada-tab>
          <ada-tab name="bottom-panel.more">
            <further-information />
          </ada-tab>
        </ada-tabs>
        <loading :loading="showLoading" />
      </div>
      <header class="header" v-show="tab.title != ''">
        <ada-toggle v-model="active" class="tabs">
          <ada-btn class="tab" v-for="t in headers" :key="t.title" :model="t">
            {{ $t(t.title) }}
          </ada-btn>
        </ada-toggle>
        <ada-spacer />
        <ada-btn class="tw-mx-[5px]" :width="24" :height="24" @click="expand()">
          <ada-icon color="primary" :size="16"> isax-maximize-3 </ada-icon>
        </ada-btn>
        <ada-btn color="primary" :width="24" :height="24" @click="close()">
          <ada-icon color="white" :size="16">isax-minus</ada-icon>
        </ada-btn>
      </header>
    </div>
    <ada-toggle class="tabs" v-model="tab">
      <ada-btn class="tab" v-for="(t, i) in tabs" :key="t.title" :model="t">
        {{ $t(t.title) }}
        <bar v-if="i < tabs.length - 1" />
      </ada-btn>
    </ada-toggle>
  </footer>
</template>
