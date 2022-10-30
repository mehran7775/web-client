<script setup lang="ts">
import { TabItem } from "@/types"
import { find } from "property-information";
import { useInstrument, useBottomPanel } from "~~/composables";

const instrumentManager = useInstrument();
const bottomPanel = useBottomPanel();
const router = useRouter()
const route = useRoute()

const tabs =  bottomPanel.tabs;


function close() {
  router.push(`/watchlist/${ route.params.name }`)
  bottomPanel.activeTab = null;
}
function expand() {
  bottomPanel.toggleExpand();
}
const showLoading = computed(() => bottomPanel.loading)
const expanded = computed(() => bottomPanel.expanded)

const active = computed({
  get() {
    if (bottomPanel.activeTab && bottomPanel.activeTab.current) {
      return bottomPanel.activeTab.children.find(q => q.path == bottomPanel.activeTab.current)
    }
    return null;
  }, set(val) {
    bottomPanel.activeTab.current = val?.path
  }
});



</script>

<style lang="postcss" scoped>
.ada-bottom-panel {
  @apply tw-flex tw-flex-col tw-flex-grow;
  @apply tw-transition-all tw-ease-in-out tw-duration-700;
  position: fixed;
  bottom: 32px;
  left: 48px;
  right: 48px;
  width: calc(100% - 96px);
  /* left: 48px;
  right: 48px; */

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
      @apply tw-absolute tw-flex tw-flex-grow tw-items-center tw-w-full tw-bg-primary/10 tw-shadow tw-shadow-primary/50;
      top: 0;
      left: 0;
      height: 32px;
      padding: 0 12px;

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

        .tab :deep(p) {
          @apply tw-p-5 tw-leading-8;
        }
      }

      .tab--active {
        @apply tw-overflow-auto;
      }

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

<style lang="postcss">
.dashboardmain-page{
  &.left{
    .ada-bottom-panel {
      @apply tw-pl-[208px]
    }
  }
  &.right{
    .ada-bottom-panel {
      @apply tw-pr-[208px]
    }
  }
}
</style>

<template>
  <footer class="ada-bottom-panel" :class="{
    half: bottomPanel.activeTab != null && !expanded,
    expanded: bottomPanel.activeTab != null && expanded
  }">

    <div class="detail"  v-if="bottomPanel.activeTab">
      <div class="contents">
        <slot></slot>

      </div>
      <header class="header">
        <ada-toggle v-model="active" class="b-tabs">
          <ada-btn class="tab-title" v-for="(t, i) in bottomPanel.activeTab?.children" :key="t.title" :model="t" 
          :match="t.match"
          :to="`/watchlist/${ $route.params.name }/${ t.path?? '' }` "
          >
            {{ $t(t.title) }}  <span v-if="t.secondTitle">{{ ` - ${ t.secondTitle }` }}</span>
            <div v-if="i != bottomPanel.activeTab.children.length - 1" class="bar"></div>
          </ada-btn>
        </ada-toggle>
        <ada-btn class="tw-mx-[5px] tw-h-[24px] tw-w-[24px]"
          :class="[expanded && bottomPanel.activeTab != null ? 'tw-bg-primary' : 'tw-bg-transparent']" @click="expand">
          <ada-icon :class="[expanded && bottomPanel.activeTab != null ? 'tw-text-white' : 'tw-text-primary']" :size="16"> isax-maximize-3
          </ada-icon>
        </ada-btn>
        <ada-btn class="tw-h-[24px] tw-w-[24px] tw-bg-primary" @click="close">
          <ada-icon class="tw-text-white" :size="16">mdi-window-close</ada-icon>
        </ada-btn>
      </header>
    </div>
  
    <ada-toggle class="b-tabs" v-model="bottomPanel.activeTab">
      <ada-btn class="tab-title" v-for="(t, i) in tabs" :key="t.path"
      :to="`/watchlist/${ $route.params.name }/${ t.current }`"
        :model="t" :match="t.match">
        <span :class="{ 'active': bottomPanel.activeTab != null && bottomPanel.activeTab.title == t.title }">
          {{ $t(t.title) }}
          <span
            v-text="instrumentManager.state.selected && !t.deletable ? '-' + instrumentManager.state.selected.name : ''"></span>
        </span>
        <div v-if="i != tabs.length - 1" class="bar"></div>
        <ada-btn v-if="t.deletable" class="tw-absolute tw-items-center tw-leading-[12px] tw-top-2 tw-left-2 tw-h-[18px] tw-w-[18px] tw-bg-error" @click.stop.prevent="bottomPanel.removeTab(t)">
          <ada-icon class="tw-font-bold tw-text-white">
            mdi-close
          </ada-icon>
        </ada-btn>
      </ada-btn>
    </ada-toggle> 
  </footer>
</template>
