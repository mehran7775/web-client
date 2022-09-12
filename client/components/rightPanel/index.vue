<script setup lang="ts">
import { ComputedRef } from "vue";
import { useShortcut } from "@/utils/shortcutManager";
import { BookmarkPosition, CreateBookmark, MenuItem, TabItem } from "~/types";
import { useAsrTrader, useUser, useChat } from "~/composables";
import { getMenuItems } from "./items";

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    mini?: boolean;
    clipped?: boolean;
  }>(),
  {
    modelValue: true,
    mini: false,
    clipped: true,
  }
);

const emit = defineEmits([
  "update:modelValue",
  "update:mini",
  "update:clipped",
]);

const userManager = useUser();
const appManager = useAsrTrader();
const router = useRouter();
const sh = useShortcut();
const chat = useChat();
const selected = computed({
  get() {
    return appManager.menu;
  },
  set(val: string | number | null) {
    appManager.setMenu(val);
  },
});
const bottomPanel = useBottomPanel();
const rtl = computed(() => appManager.rtl);
const bookmarks = computed(() => userManager.getBookmarks);
const shourtcuts = computed(() => userManager.getShourtcuts);
const home = computed(() => userManager.me.settings?.home);
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
    });
  }
  return res;
});

const secondWatchList = ref<MenuItem[]>([
  {
    bookmarkPosition: 1,
    icon: "isax-eye",
    text: "تابلوخوانی",
    title: "تابلوخوانی",
    to: "/watchList/تابلوخوانی",
  },
  {
    bookmarkPosition: 1,
    icon: "isax-eye",
    text: "توصیفی",
    title: "توصیفی",
    to: "/watchList/توصیفی",
  },
  {
    bookmarkPosition: 1,
    icon: "isax-eye",
    text: "تکنیکال",
    title: "تکنیکال",
    to: "/watchList/تکنیکال",
  },
  {
    bookmarkPosition: 1,
    icon: "isax-eye",
    text: "بنیادی",
    title: "بنیادی",
    to: "/watchList/بنیادی",
  },
]);

const items = getMenuItems(watchList, secondWatchList);

const drawer = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    emit("update:modelValue", value);
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

function setOnBottomPanel(value: MenuItem): void {
  const component = "pages-" + value.to.replaceAll("/", "-").substring(1);
  const tab: TabItem = {
    title: value.title,
    params: {},
    children: [],
    current: value.title,
    component: component,
    deletable: true,
  };
  if (isExistTab(tab)) {
    bottomPanel.removeTab(tab);
    return;
  }
  const res = existDeletableTab();
  res ? bottomPanel.removeTab(res) : null;

  bottomPanel.registerTab(tab);
  bottomPanel.activeTab = tab;
}
const isExistTab = (tab: TabItem): boolean => {
  if (bottomPanel.state._tabs[tab.title]) {
    return true;
  }
  return false;
};
const existDeletableTab = (): TabItem | undefined => {
  return bottomPanel.tabs.find((item) => item.deletable === true);
};

watch(selected, (n, o) => {
  if (typeof n == "undefined" || n == null) {
    emit("update:mini", true);
  } else {
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
  font-size: 0.875rem;
  /* padding-top: 42px; */
  @apply tw-bg-primary tw-bg-opacity-10;

  &::before {
    @apply tw-inset-0 tw-absolute tw-w-full tw-h-full;
    z-index: -1;
    background-color: white;
    content: "";
    touch-action: none;
    pointer-events: none;
  }

  .tabs {
    @apply tw-items-center tw-px-2 tw-shadow-[-2px_1px_2px_0] tw-shadow-primary/20;
    padding-top: 8px;
    height: calc(100vh - 42px);
    padding-bottom: 54px;
    min-width: 48px;
    width: 48px;
    max-width: 48px;
    flex-basis: 48px;

    .icon {
      font-size: 1.5rem;
    }

    .divider {
      @apply tw-text-gray3;
    }
    .chat-icon {
      @apply tw-rounded-full tw-bg-primary tw-w-11 tw-h-11 tw-mt-12;
      &.active {
        @apply tw-bg-primary;
        i {
          @apply tw-text-white;
        }
      }
      i {
        @apply tw-text-white;
      }
    }
  }

  .tab-items {
    min-width: 208px;
    /* background-color: rgba(var(--c-primary), 0.01); */
    width: calc(100% - 48px);

    .tab {
      @apply tw-flex tw-flex-col tw-flex-grow;
      flex-basis: 32px;
      overflow-y: auto;
    }
    .chatroom {
      @apply tw-relative tw-h-full;
      &__avatar {
        @apply tw-mx-auto tw-mt-4 tw-bg-primary tw-bg-opacity-10 tw-rounded-full tw-flex tw-justify-center tw-items-center tw-p-2;
        i { @apply tw-text-primary; }
      }

      &__activator {
        @apply tw-absolute tw-bottom-10 tw-left-0 tw-w-full tw-px-6;

        .ada-input {
          & :deep(.scaffold) {
            @apply tw-border-none tw-bg-transparent;
            input {
              @apply tw-border tw-bg-white tw-border-primary tw-border-opacity-50 tw-text-primary;
              &::placeholder {
                @apply tw-text-primary tw-text-opacity-50;
              }
            }

          }
          & :deep(.ada-button) {
            @apply tw-bg-transparent;
            .icon {
              @apply tw-text-primary tw-text-opacity-90 tw-rotate-180 tw-mr-1 hover:tw-text-opacity-100;
            }
          }
        }
      }
    }
  }

  .ada-button {
    @apply tw-bg-transparent tw-w-[32px] tw-h-[32px];

    &.active {
      @apply tw-bg-primary tw-bg-opacity-20;

      .icon {
        @apply tw-text-primary;
      }
    }
  }
}
</style>
<style lang="postcss">
.r-panel {
  .router-link-active,
  .router-link-exact-active {
    @apply tw-bg-primary tw-bg-opacity-10;
  }
}
</style>

<template>
  <ada-nav
    v-model="drawer"
    min-width="48px"
    max-width="256px"
    v-model:mini="mini"
    class="r-panel"
    mobile-breakpoint="960"
    fixed
  >
    <ada-toggle class="tabs" v-model="selected" vertical>
      <ada-tooltip position="left">
        <template #activator>
          <ada-btn :to="home" :model="null">
            <ada-icon size="18"> isax-home-2 </ada-icon>
          </ada-btn>
        </template>
        <span>{{ $t("menu.home") }}</span>
      </ada-tooltip>
      <ada-tooltip v-for="item in items" :key="item.title" position="left">
        <template #activator>
          <ada-btn
            :model="item.title"
            @click="
              () => {
                $emit('update:mini', !mini);
              }
            "
          >
            <ada-icon
              size="18"
              :class="[item.color ? `tw-text-${item.color}` : null]"
            >
              {{ item.icon }}
            </ada-icon>
          </ada-btn>
        </template>
        <span>{{ item.text ? item.text : $t(item.title) }}</span>
      </ada-tooltip>
      <hr class="divider" />
      <ada-tooltip v-for="item in shourtcuts" :key="item.title" position="left">
        <template #activator>
          <ada-btn
            :to="item.to"
            @click="
              () => {
                $emit('update:mini', true);
              }
            "
            depressed
          >
            <ada-icon size="18" :class="`tw-text-${item.color}`">
              {{ item.icon }}
            </ada-icon>
          </ada-btn>
        </template>
        <span>{{ item.text ? item.text : $t(item.title) }}</span>
      </ada-tooltip>

      <ada-tooltip position="left">
        <template #activator>
          <ada-btn
            class="chat-icon"
            model="menu.chat"
            @click="$emit('update:mini', !mini)"
          >
            <ada-icon color="white" :size="24"> isax-messages-2-bold </ada-icon>
          </ada-btn>
        </template>
        <span v-text="$t('general.chat')"></span>
      </ada-tooltip>
    </ada-toggle>

    <ada-tabs class="tab-items" v-model="selected">
      <ada-tab v-for="item in items" :key="item.title" :name="item.title">
        <h6
          class="tw-flex tw-flex-shrink-0 tw-h-[42px] tw-justify-center tw-items-center"
        >
          {{ $t(item.title) }}
        </h6>
        <ada-list>
          <ada-list-item
            v-for="(child, i) in item.children ? item.children : []"
            :key="i"
            :value="child"
          >
            <template #item="{ value }">
              <div
                class="tw-w-full tw-h-full tw-flex tw-justify-between tw-items-center"
              >
                <span
                  >{{ value.text ? value.text : $t(value.title)
                  }}{{ value.expand }}</span
                >
                <span
                  v-if="value.to && value.to != ''"
                  class="tw-flex tw-items-baseline"
                >
                  <ada-icon
                    size="1.34rem"
                    :class="[
                      isMarked(value) ? 'tw-text-primary' : 'tw-text-gray4',
                    ]"
                    @click.stop.prevent="
                      () => {
                        if (isMarked(value)) unmark(value);
                        else mark(value);
                      }
                    "
                    >{{
                      isMarked(value) ? "mdi-bookmark" : "mdi-bookmark-outline"
                    }}</ada-icon
                  >
                  <ada-icon
                    @click.stop.prevent="
                      () => {
                        setHome(value);
                      }
                    "
                    size="1.34rem"
                    :class="[
                      value.to == home ? 'tw-text-primary' : 'tw-text-gray4',
                    ]"
                  >
                    {{ value.to == home ? "isax-star-1-bold" : "isax-star-1" }}
                  </ada-icon>
                  <ada-icon
                    v-if="!/watchlist/gi.test(value.to)"
                    size="1.34rem"
                    :class="[
                      isExistTab(value) ? 'tw-text-primary' : 'tw-text-gray4',
                    ]"
                    @click.stop.prevent="setOnBottomPanel(value)"
                    >{{
                      isExistTab(value)
                        ? "mdi-arrow-down-bold"
                        : "mdi-arrow-down-bold-outline"
                    }}</ada-icon
                  >
                </span>
              </div>
            </template>
          </ada-list-item>
        </ada-list>
      </ada-tab>
      <ada-tab name="menu.chat">
        <div class="chatroom">
          <header>
            <ada-tooltip position="left">
              <template #activator>
               <div class="chatroom__avatar"> <ada-icon size="2.5rem">isax-frame-bold</ada-icon></div>
                <!-- <img class="chatroom__avatar" src="/logo.png" /> -->
              </template>
              <span v-text="$t('general.supporter')"></span>
            </ada-tooltip>
          </header>
          <body class="chatroom__messages">
            <div class="chatroom__message"></div>
          </body>

          <footer class="chatroom__activator">
            <ada-input :placeholder="$t('general.messagePlaceholder')">
              <template #append>
               <ada-tooltip position="left">
                <template #activator>
                  <ada-btn @click.stop="chat.send('')">
                    <ada-icon size="2.5rem">mdi-send-circle</ada-icon>
                  </ada-btn>
                </template>
                <span v-text="$t('general.send')"></span>
               </ada-tooltip>
              </template>
            </ada-input>
          </footer>
        </div>
      </ada-tab>
    </ada-tabs>
  </ada-nav>
</template>
