<script setup lang="ts">
import { TabItem } from "@/types"
import { useInstrument, useBottomPanel } from "~~/composables";
import defaultTabs from "./tabs";


const instrumentManager = useInstrument();
const bottomPanel = useBottomPanel();


const tabs = computed(() => bottomPanel.tabs);
const tab = computed({
  get() {
    return bottomPanel.activeTab
  },
  set(val: TabItem) {
    bottomPanel.activeTab = val
  }
});

function close() {
  tab.value = null;
}
function expand() {
  bottomPanel.toggleExpand();
}
const showLoading = computed(() => bottomPanel.loading)
const expanded = computed(() => bottomPanel.expanded)

const active = computed({
  get() {
    if (tab.value && tab.value.current) {
      return tab.value.children.find(q => q.title == tab.value.current)
    }
    return null;
  }, set(val) {
    tab.value.current = val?.title
  }
});

//Register Default Tabs
for (let i in defaultTabs) {
  bottomPanel.registerTab((defaultTabs as Array<TabItem>)[i]);
}


</script>

<style lang="postcss" scoped>
.ada-bottom-panel {
  @apply tw-flex tw-flex-col tw-flex-grow tw-w-full;
  @apply tw-transition-all tw-ease-in-out tw-duration-700;
  position: fixed;
  bottom: 32px;

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
    @apply tw-relative tw-w-full tw-bg-white;
    font-size: 1rem;
    line-height: 1.5;
    height: calc(100% - 32px);

    >.header {
      @apply tw-absolute tw-flex tw-flex-grow tw-w-full tw-bg-primary/10 tw-shadow tw-shadow-primary/50;
      top: 0;
      left: 0;
      height: 32px;
      padding: 0 0 0 12px;

      .b-tabs {
        @apply tw-bg-transparent;
      }
    }

    >.contents {
      @apply tw-mt-[32px];
      overflow-y: auto;
      height: calc(100% - 32px);

      .tabs {
        @apply tw-h-full;
      }

      .tab--active { @apply tw-overflow-auto; }

    }
  }

  .b-tabs {
    @apply tw-justify-start tw-w-full tw-relative tw-bg-primary/10;
    box-shadow: 0 0 1px 0 #e2e2e2;
    min-height: 32px;
    max-height: 32px;

    .tab-title {
      @apply tw-bg-transparent tw-border-none tw-min-h-[32px] tw-min-w-[168px];
      margin-inline-start: 3px;

      &::after {
        @apply tw-bg-primary/20 tw-opacity-100;
        border-radius: 0 !important;
      }
    }

    &::before {
      @apply tw-absolute tw-inset-0 tw-w-full tw-h-full;
      content: '';
      pointer-events: none;

    }
  }

  .active {
    @apply tw-text-primary;
  }

}
</style>

<template>
  <footer class="ada-bottom-panel" :class="{
    half: tab != null
  }">
    <div class="detail" v-if="tab != null">
      <div class="contents">
        <ada-tabs v-model="tab">
          <ada-tab v-for="t in tabs" :key="t.title" :model="t">
            <component v-if="t.component" :is="t.component" v-model="active" :tabs="t.children"></component>
          </ada-tab>
        </ada-tabs>
      </div>
      <header class="header">
        <ada-toggle v-model="active" class="b-tabs">
          <ada-btn class="tab-title" v-for="(t, i) in tab.children" :key="t.title" :model="t">
            {{ $t(t.title) }}
            <div v-if="i != tab.children.length - 1" class="bar"></div>
          </ada-btn>
        </ada-toggle>
        <ada-btn class="tw-mx-[5px]" :class="expanded && tab != null ? 'tw-text-primary' : 'tw-text-transparent'"
          :width="24" :height="24" @click="expand">
          <ada-icon :color="expanded && tab != null ? 'white' : 'primary'" :size="16"> isax-maximize-3
          </ada-icon>
        </ada-btn>
        <ada-btn color="primary" @click="close">
          <ada-icon color="white" :size="16">mdi-window-close</ada-icon>
        </ada-btn>
      </header>
    </div>
    <ada-toggle class="b-tabs" v-model="tab">
      <ada-btn class="tab-title" v-for="(t, i) in tabs" :key="t.title" :model="t">
        <span :class="{ 'active': tab != null && tab.title == t.title }">
          {{ $t(t.title) }}
          <span
            v-text="instrumentManager.state.selected && !t.deletable ? '-' + instrumentManager.state.selected.name : ''"></span>
        </span>
        <div v-if="i != tabs.length - 1" class="bar"></div>
        <ada-icon size="1.3rem" v-if="t.deletable" class="tw-absolute tw-top-[1px] tw-left-[5px] hover:tw-text-gray3"
          @click.stop.prevent="bottomPanel.removeTab(t)">mdi-close</ada-icon>
      </ada-btn>
    </ada-toggle>
  </footer>
</template>
