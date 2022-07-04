<script setup lang="ts">
import { computed, ref, onMounted, Ref, onBeforeUnmount } from "#app";
import { useShortcut } from "@/utils/shortcutManager";
import CardView from "./cardView.vue";
import TabView from "./tabView.vue";
import { Bookmark } from "~/types";
import { useInstrument, useUser } from "~/composables";
import { useRoute } from "#app";
import AdaToggle from "@/components/adaToggle.vue"

const instrumentManager = useInstrument();
const userManager = useUser();
const sh = useShortcut();
const route = useRoute();
const toolbar = ref<HTMLElement | null>(null)

const me = userManager.me;
const bookmarks = computed(() => userManager.getBookmarks);
const home = computed(() => me.settings.home);
const path = computed(() => route.fullPath);
const filter = computed(() => instrumentManager.state.selected);

const instruments = computed(() => instrumentManager.getFocus);

const viewMode = computed({
  get() {
    return instrumentManager.focusMode;
  },
  set(val: number) {
    instrumentManager.setFocusMode(val);
  },
});

async function setHome() {
  await userManager.update_settings({
    path: "/home",
    value: path.value,
  });
}

async function unmark(bookmark: Bookmark) {
  const tmp = [...bookmarks.value.filter((item) => item.to != bookmark.to)];
  userManager.update_settings({
    path: "/bookmarks",
    value: tmp,
  });
}

function deselect() {
  instrumentManager.select(null);
}

if (process.client) {
  sh.addShortcut({
    key: "alt+q",
    action: () => {
      instrumentManager.setFocusMode((instrumentManager.focusMode + 1) % 2);
    },
  });
  function resize() {
    instrumentManager.setWidth(toolbar.value?.offsetWidth || 800);
  }
  onMounted(() => {
    window.addEventListener("mousemove", resize);
  });
  onBeforeUnmount(() => {
    window.removeEventListener("mousemove", resize);
  });
}
</script>

<style lang="postcss" scoped>
.focus-board {
  @apply tw-h-[320px] tw-w-full;
}

.toolbar {
  @apply tw-flex tw-flex-grow;
  height: 42px;
  padding: 0 8px 0 8px;
  position: relative;
  align-items: center;
  background-color: var(--c-default-bg-rbg);
}

.bookmark {
  @apply tw-mx-[4px] tw-px-[4px] tw-rounded-md tw-bg-primary-100 tw-w-[110px] tw-h-[28px] tw-text-primary;
  @apply tw-flex tw-items-center tw-justify-between tw-text-ellipsis tw-overflow-hidden tw-whitespace-nowrap;

  &.nuxt-link-exact-active,
  &.nuxt-link-active {
    @apply tw-border tw-border-primary;
  }

  >.label {
    font-size: 0.8334rem;
    display: inline-block;
    max-width: 67px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .removeMark {
    position: absolute;
    top: -10px;
    left: -6px;
    z-index: 1000;
    display: none;
  }

  &:hover {
    .removeMark {
      display: block;
    }
  }
}

.mode {
  >.filter {
    @apply tw-flex tw-flex-row tw-items-center tw-justify-items-stretch tw-px-2 tw-mx-3;
    min-width: 110px;
    background-color: rgba(var(--c-primary), 0.05);
    border-radius: var(--border-radius-root);
    border: solid 1px rgba(var(--c-primary), 0.5);

    >.filter {
      @apply tw-flex tw-mx-2;
    }

    >.txt {
      @apply tw-flex tw-flex-grow;
    }

    >.close {
      @apply tw-flex tw-justify-self-end tw-mx-2;
    }
  }

  >button {
    border-radius: var(--border-radius-root);
    border: none !important;
  }
}
</style>

<style lang="postcss">
.focus-board {
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.15);

  .row {
    margin: 0;
    padding: 0;
    min-height: 32px;

    .col {
      min-height: 32px;
    }
  }
}
</style>

<template>
  <div class="tw-m-0 tw-p-0">
    <header ref="toolbar" class="toolbar">
      <slot name="toolbar"> </slot>
      <span v-if="bookmarks.length > 0"
        class="tw-h-7 tw-border-r-2 tw-rounded-md tw-border-primary-200 tw-mr-3 tw-ml-2"></span>
      <nuxt-link v-for="b in bookmarks" :key="b.to" :to="b.to" class="bookmark">
        <span v-text="b.text ? b.text : $t(b.title)"></span>
        <ada-icon :size="14" class="tw-w-8 tw-h-full" @click="unmark(b)">mdi-close</ada-icon>
      </nuxt-link>
      <ada-toggle class="mode tw-justify-end" color="primary" v-model="viewMode">
        <!-- <div v-if="filter" class="filter">
          <ada-icon class="filter" :size="14" color="primary">isax-search-normal-1</ada-icon>
          <span class="txt">
            {{ filter.name }}
          </span>
          <ada-icon class="close" @click="deselect" :size="14" color="primary">mdi-close</ada-icon>
        </div> -->
        <ada-btn :height="28" :width="28" :model="0">
          <ada-icon :color="viewMode == 0 ? 'primary' : 'gray'" :size="16">
            isax-menu
          </ada-icon>
        </ada-btn>
        <ada-btn :height="28" :width="28" :model="1">
          <ada-icon :color="viewMode == 1 ? 'primary' : 'gray'" :size="16">
            isax-element-3-bold
          </ada-icon>
        </ada-btn>
      </ada-toggle>
    </header>
    <ada-tabs class="focus-board" v-if="instruments.length > 0" v-model="viewMode">
      <ada-tab :model="0">
        <tab-view />
      </ada-tab>
      <ada-tab :model="1">
        <card-view />
      </ada-tab>
    </ada-tabs>

  </div>
</template>
