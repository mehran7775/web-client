<script setup lang="ts">
import { defineComponent, ref, Ref, computed, watch, ComputedRef } from "#app";
import { useShortcut } from "@/utils/shortcutManager";
import { BookmarkPosition, CreateBookmark, MenuItem } from "~/types";
import { useAsrTrader, useUser } from "~/composables";
import { getMenuItems } from "./items";
import { useRouter } from "#app";

const props = defineProps<{
  value: boolean;
  mini: boolean;
  clipped: boolean;
}>();

const emit = defineEmits(["input", "update:mini", "closeLeftPanel"]);

const userManager = useUser();
const appManager = useAsrTrader();
const router = useRouter();
const sh = useShortcut();
const selected = computed({
  get() {
    return appManager.menu;
  },
  set(val: string | number | null) {
    appManager.setMenu(val);
  },
});
const rtl = computed(() => appManager.rtl);
const bookmarks = computed(() => userManager.getBookmarks);
const shourtcuts = computed(() => userManager.getShourtcuts);
const isMarked = computed(() => (data: MenuItem) => {
  switch (data.bookmarkPosition) {
    case BookmarkPosition.ToolBar:
      return bookmarks.value.findIndex((val) => val.title == data.title) > -1;
    case BookmarkPosition.RightPanel:
      return shourtcuts.value.findIndex((val) => val.title == data.title) > -1;
  }
});
const watchList: ComputedRef<Array<MenuItem>> = computed(() => {
  const lists = computed(() => userManager.watchList);
  const res = [];
  for (let k in lists.value) {
    res.push({
      icon: "isax-eye",
      title: k,
      text: k,
      to: "/watchList/" + k,
      bookmarkPosition: BookmarkPosition.ToolBar,
    });
  }
  if (res.length == 0) {
    res.push({
      icon: "isax-eye",
      title: "new",
      text: "new",
      to: "/watchList/new",
      bookmarkPosition: BookmarkPosition.ToolBar,
    })
  }
  return res;
});
const items = getMenuItems(watchList);
const home = computed(() => userManager.me.settings.home);

const drawer = computed({
  get() {
    return props.value;
  },
  set(value: boolean) {
    emit("input", value);
  },
});
function setHome(item: MenuItem) {
  if (item.to)
    userManager.update_settings({
      path: "/home",
      value: item.to,
    });
}
function mark(data: MenuItem) {
  const bk = CreateBookmark(data);
  switch (data.bookmarkPosition) {
    case BookmarkPosition.ToolBar:
      {
        const tmp = [...bookmarks.value, bk];
        userManager.update_settings({
          path: "/bookmarks",
          value: tmp,
        });
      }
      break;
    case BookmarkPosition.RightPanel:
      {
        const tmp = [...shourtcuts.value, bk];
        userManager.update_settings({
          path: "/shourtcuts",
          value: tmp,
        });
      }
      break;
  }
}
function unmark(data: MenuItem) {
  switch (data.bookmarkPosition) {
    case BookmarkPosition.ToolBar:
      {
        let tmp = [...bookmarks.value];
        tmp.splice(
          tmp.findIndex((item) => item.to == data.to),
          1
        );
        userManager.update_settings({
          path: "/bookmarks",
          value: tmp,
        });
      }
      break;
    case BookmarkPosition.RightPanel:
      {
        let tmp = [...shourtcuts.value];
        tmp.splice(
          tmp.findIndex((item) => item.to == data.to),
          1
        );
        userManager.update_settings({
          path: "/shourtcuts",
          value: tmp,
        });
      }
      break;
  }
}
watch(selected, (n, o) => {
  if (typeof n == "string" || typeof n != null) {
    emit("update:mini", false);
  }
});
if (process.client) {
  for (let i = 1; i < 10; i++) {
    sh.addShortcut({
      key: "alt+Digit" + i.toString(),
      action: () => {
        if (i <= watchList.value.length) {
          router.push(watchList.value[i - 1].to ?? "#");
        }
      },
    });
  }
}
</script>

<style lang="postcss" scoped>
.r-panel {
  padding-top: 42px;
  background-color: rgba(var(--c-primary), 0.01);

  &::before {
    @apply tw-inset-0 tw-absolute tw-w-full tw-h-full;
    z-index: -1;
    background-color: white;
    content: '';
    touch-action: none;
    pointer-events: none;
  }

  .toggle.tabs {
    @apply tw-items-center tw-overflow-y-auto tw-px-2;
    height: calc(100vh - 42px);
    padding-bottom: 54px;
    min-width: 48px;
    width: 48px;
    max-width: 48px;
    flex-basis: 48px;
    box-shadow: -2px 1px 2px 0 rgba(var(--c-primary), 0.2);


    .icon {
      font-size: 1.5rem;
    }
  }

  .tabs.tab-items {
    min-width: 208px;
    background-color: rgba(var(--c-primary), 0.01);
    width: calc(100% - 48px);

    .tab {
      @apply tw-flex tw-flex-col tw-flex-grow;
      flex-basis: 32px;
      overflow-y: auto;
    }
  }
}
</style>

<template>
  <ada-nav v-model="drawer" min-width="48px" max-width="256px" :right="rtl" :mini="mini" class="r-panel"
    mobile-breakpoint="960" fixed>
    <ada-toggle class="tabs" v-model="selected" vertical>
      <v-tooltip v-for="item in items" :key="item.title" left>
        <template #activator="{ on, attrs }">
          <ada-btn :width="32" :height="32" color="transparent" :model="item.title" @click="
            () => {
              $emit('closeLeftPanel')
              $emit('update:mini', !mini);
            }
          ">
            <ada-icon size="18" :color="item.color" v-bind="attrs" v-on="on">
              {{ item.icon }}
            </ada-icon>
          </ada-btn>
        </template>
        <span>{{ item.text ? item.text : $t(item.title) }}</span>
      </v-tooltip>
      <hr class="divider" />
      <ada-btn v-for="item in shourtcuts" :key="item.title" :to="item.to" @click="
        () => {
          $emit('update:mini', true);
        }
      ">
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <ada-btn width="32" height="32" color="transparent" depressed>
              <ada-icon size="18" :color="item.color" v-bind="attrs" v-on="on">
                {{ item.icon }}
              </ada-icon>
            </ada-btn>
          </template>
          <span>{{ item.text ? item.text : $t(item.title) }}</span>
        </v-tooltip>
      </ada-btn>
    </ada-toggle>

    <ada-tabs class="tab-items" v-model="selected">
      <ada-tab v-for="item in items" :key="item.title" :name="item.title">
        <h4 class="tw-flex tw-flex-shrink-0 tw-h-[42px] tw-justify-center tw-items-center">
          {{ $t(item.title) }}
        </h4>
        <ada-list>
          <ada-list-item v-for="child in item.children ? item.children : []" :key="child.title" :value="child">
          </ada-list-item>
        </ada-list>
      </ada-tab>
    </ada-tabs>
  </ada-nav>
</template>
