<script setup lang="ts">
import { ref, Ref, computed, ComputedRef } from "#app";
import { OrderFlags, OrderSearchModel, TabItem, defaultItem } from "@/types";
import furtherInformation from "./furtherInformation/index.vue";
import DefaultOrderList from "./defaultOrderList.vue";
import DateInfo from "./DateInfo.vue";
import CompleteInfo from "./CompleteInfo.vue";
import StatisticsKeys from "./StatisticsKeys.vue"
import { useBottomPanel } from "~/composables";
import AdaToggle from "@/components/adaToggle.vue";
import AdaBtn from "@/components/adaBtn.vue";
import AdaTabs from "@/components/adaTabs/index.vue"
import AdaTab from "@/components/adaTabs/adaTab.vue"



const bottomPanel = useBottomPanel();
const active: Ref<TabItem> = ref(defaultItem)
const tabs = computed(() => bottomPanel.tabs);
const props = withDefaults(
  defineProps<{
    slideToBottom: boolean
  }>(),
  {
    slideToBottom: false
  }
);
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
  @apply tw-transition-all tw-ease-in-out tw-duration-700;
  position: fixed;
  bottom: 32px;
  background-color: white;

  &.slideToBottom {
    bottom: 0;
  }

  &.expanded {
    height: calc(100vh - 74px);

    &.slideToBottom {
      height: calc(100vh - 42px);
    }
  }

  &.half {
    height: calc(100vh - 436px);
    min-height: 30vh;

    &.slideToBottom {
      height: calc(100vh - 404px);
    }
  }

  &.hidden {
    height: 32px;
    /* background-color: red; */
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
      padding: 0 0 0 12px;
      top: 0;
      left: 0;

      >.tabs {
        @apply tw-justify-start tw-w-full tw-items-end;
        color: rgb(0, 0, 0);
        box-shadow: 0 0 1px 0 #e2e2e2;
        height: 32px;

        .tab {
          @apply tw-px-1;
          background-color: rgba(0, 0, 0, 0);
          min-width: 168px;
          border-radius: 0 !important;

          &::after {
            border-radius: 0 !important;
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
    @apply tw-justify-start tw-w-full tw-relative;
    background-color: rgba(var(--c-primary), 0.2);
    box-shadow: 0 0 1px 0 #e2e2e2;
    min-height: 32px;
    max-height: 32px;

    .tab {
      background-color: rgba(0, 0, 0, 0);
      border: none;
      min-width: 168px;
      margin-inline-start: 3px;

      &::after {
        border-radius: 0 !important;
      }
    }

    &::before {
      @apply tw-absolute tw-inset-0 tw-w-full tw-h-full;
      content: '';
      pointer-events: none;
      background-color: white;
    }
  }
  .active {
    color: var(--c-blue-rgb);
  }

}
</style>

<template>
  <footer :class="{
    footer: true,
    expanded: expanded && tab != defaultItem,
    half: tab != defaultItem && !expanded,
    hidden: tab == defaultItem,
    slideToBottom: props.slideToBottom
  }">
    <div class="detail">
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
          <ada-tab name="bottom-panel.completeInfo">
            <complete-info />
          </ada-tab>
          <ada-tab name="bottom-panel.dateInfo">
            <date-info />
          </ada-tab>
          <ada-tab name="bottom-panel.more">
            <further-information />
          </ada-tab>
          <ada-tab name="bottom-panel.statisticsKeys">
            <statistics-keys />
          </ada-tab>
        </ada-tabs>
        <loading :loading="showLoading" />
      </div>
      <header class="header" v-show="tab.title != ''">
        <ada-toggle v-model="active" class="tabs">
          <ada-btn :height="32" class="tab" v-for="(t, i) in headers" :key="t.title" :model="t">
            {{ $t(t.title) }}
            <bar v-if="i != headers.length - 1" />
          </ada-btn>
        </ada-toggle>
        <ada-spacer />
        <ada-btn class="tw-mx-[5px]" :color="expanded && tab != defaultItem ? 'primary' : 'transparent'" :width="24"
          :height="24" @click="expand()">
          <ada-icon :color="expanded && tab != defaultItem ? 'white' : 'primary'" :size="16"> isax-maximize-3
          </ada-icon>
        </ada-btn>
        <ada-btn color="primary" :width="24" :height="24" @click="close()">
          <ada-icon color="white" :size="16">mdi-window-close</ada-icon>
        </ada-btn>
      </header>
    </div>
    <ada-toggle class="tabs" v-model="tab">
      <ada-btn class="tab" v-for="(t, i) in tabs" :key="t.title" :model="t">
          <span v-text="$t(t.title)" :class="{ 'active' : tab.title == t.title}"></span>
        <bar v-if="i != tabs.length - 1" />
      </ada-btn>
    </ada-toggle>
  </footer>
</template>
