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

//////////////

const emit = defineEmits([
  "update:modelValue",
  "update:mini",
  "update:clipped",
]);

/////////////

const userManager = useUser();
const appManager = useAsrTrader();
const router = useRouter();
const route = useRoute()
const sh = useShortcut();
const chat = useChat();

const inputChat = ref<string>("");

//////////////////

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
const shortcuts = computed(() => userManager.getShortcuts);
const isMarked = computed(() => (data: MenuItem) => {
  switch (data.bookmarkPosition) {
    case BookmarkPosition.ToolBar:
      return bookmarks.value.findIndex((val) => val.title == data.title) > -1;
    case BookmarkPosition.RightPanel:
      return shortcuts.value.findIndex((val) => val.title == data.title) > -1;
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

const messages = chat.state.messages;
const optionMessage = ref<boolean>(false)
const activeOptionMessage = ref<boolean>(false)


const items = getMenuItems();

const drawer = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    emit("update:modelValue", value);
  },
});


////////////////

watch(selected, (n, o) => {
  if (typeof n == "undefined" || n == null) {
    emit("update:mini", true);
  } else {
    emit("update:mini", false);
  }
});

////////////////

function mark(data: MenuItem) {
  const bk = CreateBookmark(data);
  switch (data.bookmarkPosition) {
    case BookmarkPosition.ToolBar:
      console.log(1)
      {
        const tmp = [...bookmarks.value, bk];
        userManager.update_settings({
          path: "/bookmarks",
          value: tmp,
        });
      }
      break;
    case BookmarkPosition.RightPanel:
      console.log(shortcuts.value)
      {
        const tmp = [...shortcuts.value, bk];
        console.log(2, tmp)
        userManager.update_settings({
          path: "/shortcuts",
          value: tmp,
        });
      }
      break;
  }
}

function unmark(data: MenuItem) {
  switch (data.bookmarkPosition) {
    case BookmarkPosition.ToolBar:
      console.log(3)
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
    console.log(4)
      {
        let tmp = [...shortcuts.value];
        tmp.splice(
          tmp.findIndex((item) => item.to == data.to),
          1
        );
        userManager.update_settings({
          path: "/shortcuts",
          value: tmp,
        });
      }
      break;
  }
}

// function setOnBottomPanel(value: MenuItem): void {
//   const component = "pages-" + value.to.replaceAll("/", "-").substring(1);
//   const tab: TabItem = {
//     title: value.title,
//     params: {},
//     children: [],
//     current: value.title,
//     component: component,
//     deletable: true,
//   };
//   if (isExistTab(tab)) {
//     bottomPanel.removeTab(tab);
//     return;
//   }
//   const res = bottomPanel.existDeletableTab();
//   res ? bottomPanel.removeTab(res) : null;

//   bottomPanel.registerTab(tab);
//   bottomPanel.activeTab = tab;
// }



const isExistTab = (tab: TabItem): boolean => {
  if (bottomPanel.state._tabs[tab.title]) {
    return true;
  }
  return false;
};


async function sendMessage(): Promise<void> {
  if (inputChat.value) {
    chat.pusher(inputChat.value);
    const chatroom = document.querySelector(".chatroom__messages");
    await nextTick()
   
      chatroom.scrollTo({
      top: chatroom.scrollHeight,
      left: 0,
      behavior: 'smooth'
   
    })
    inputChat.value = ''
  }
}

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
    @apply tw-items-center tw-px-2 tw-shadow-[-2px_1px_2px_0] tw-shadow-primary/20 tw-overflow-y-auto;
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
  }

  .tab-items {
    width: calc(100% - 48px);
    @apply tw-shadow-[-2px_1px_2px_0] tw-overflow-clip tw-shadow-primary/20;

    .tab {
      @apply tw-flex tw-flex-col tw-flex-grow;
      flex-basis: 32px;
      overflow-y: auto;
    }
    .chatroom {
      @apply tw-h-full;
      &__avatar {
        @apply tw-mx-auto tw-mt-4 tw-text-center;
        i {
          @apply tw-text-primary;
        }
      }
      &__messages {
        @apply tw-p-2 tw-overflow-y-auto tw-justify-end tw-mt-2 tw-bg-transparent;
        height: calc(100% - 130px);

        .ada-list-item {
          @apply tw-max-h-fit;
        }
      }

      &__activator {
        @apply tw-fixed tw-bottom-10 tw-left-0 tw-w-full tw-text-center tw-bg-transparent tw-pt-2;
        > p {
          @apply tw-inline-block tw-w-3/4  tw-border tw-border-primary/80 tw-pr-2 tw-text-primary tw-bg-white;
          @apply tw-rounded-xl tw-text-right;

          &:focus {
            @apply tw-outline-none tw-border-primary/100;
          }
          &:empty::before {
            content: attr(data-placeholder);
            @apply tw-text-primary/70 tw-pr-1;
          }
        }
        .ada-button {
          .icon {
          @apply tw-text-primary tw-text-opacity-90 tw-rotate-180 tw-mr-1 hover:tw-text-opacity-100;
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
    <div class="tabs">
      <ada-tooltip v-for="item in items" :key="item.title" position="left">
        <template #activator>
          <ada-btn
          @click.stop="bottomPanel.assignTab(item)"
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
      <ada-tooltip v-for="item in shortcuts" :key="item.title" position="left">
        <template #activator>
          <ada-btn
            :to="item.to"
            depressed
          >
            <ada-icon size="18" :class="`tw-text-${item.color}`">
              {{ item.icon }}
            </ada-icon>
          </ada-btn>
        </template>
        <span>{{ item.text ? item.text : $t(item.title) }}</span>
      </ada-tooltip>
    </div>

  
  </ada-nav>
</template>
