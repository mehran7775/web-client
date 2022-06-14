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
const toolbar = ref(null)

const me = userManager.me;
const bookmarks = computed(() => userManager.getBookmarks);
const home = computed(() => me.settings.home);
const path = computed(() => route.fullPath);

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

if (process.client) {
  sh.addShortcut({
    key: "alt+q",
    action: () => {
      instrumentManager.setFocusMode((instrumentManager.focusMode + 1) % 2);
    },
  });
  function resize() {
    instrumentManager.setWidth(toolbar.value.offsetWidth);
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
  @apply tw-mx-[4px] tw-px-[4px];
  position: relative;
  width: 75px;
  min-width: 75px;
  max-width: 75px;

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

.mode {
  >button {
    border-radius: var(--border-radius-root);
    border: none !important;
  }
}
</style>

<template>
  <div class="tw-m-0 tw-p-0">
    <header ref="toolbar" class="toolbar">
      <slot name="toolbar"> </slot>
      <v-tooltip v-for="b in bookmarks" :key="b.to">
        <template #activator="{ on, attrs }">
          <ada-btn dark color="primary" :to="b.to" v-on="on" v-bind="attrs" :height="28" class="bookmark">
            <ada-btn @click.stop.prevent="() => unmark(b)" :width="14" :height="14" class="removeMark pa-0 ma-0"
              color="error">
              <ada-icon class="tw-p-0 tw-m-0" :size="12">mdi-close</ada-icon>
            </ada-btn>
            <span class="label">
              <ada-icon v-if="b.icon" :size="12"> {{ b.icon }} </ada-icon>
              {{ b.text ? b.text : $t(b.title) }}
            </span>
          </ada-btn>
        </template>
        {{ b.text ? b.text : $t(b.title) }}
      </v-tooltip>
      <ada-spacer />
      <ada-toggle class="mode tw-justify-end" color="primary" v-model="viewMode">
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
