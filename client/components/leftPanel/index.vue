<script setup lang="ts">
import { Ref } from "vue";
import {
  PaginatedResult,
  Message,
  MessageFilter,
  MessageQuery,
} from "@/types";
import {
  useAsrTrader,
  useBottomPanel,
  useMessages,
  useInstrument,
} from "~/composables";

const emit = defineEmits(["openWatchList", "update:modelValue", "update:mini"]);
const props = defineProps<{ modelValue: boolean; clipped: boolean }>();
const messageManager = useMessages();
const appManager = useAsrTrader();
const instrumentManager = useInstrument();
const bottomPanel = useBottomPanel();
const rtl = appManager.rtl;
const locale = appManager.locale;
const toggleMenu = ref<null | string>(null);
const router = useRouter()
const route = useRoute()


const drawer = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    emit("update:modelValue", value);
  },
});

const loading = ref(false);

const messages = reactive<Message[]>([])

const origins = messageManager.state.origins;

const selected = computed(() => instrumentManager.state.selected);

const mini = computed({
  get() {
    return bottomPanel.LeftPanelMini;
  },
  set(val) {
    bottomPanel.LeftPanelMini = val;
  },
});


const messageQuery =  messageManager.state.messageQuery



messageQuery.filters.origins = origins;

const items = [
  { title: "general.me" },
  { title: "general.all" },
];

const categories = messageManager.state.categories;

/////

watch(toggleMenu, (newVal, oldVal) => {
  if (typeof newVal == "undefined" || newVal == null) {
    mini.value = true;
  } else {
    mini.value = false;
  }
});

watch(
  selected,
  (newval) => {
    if (newval) {
      messageQuery.filters.title = "(" + newval?.name;
    } else {
      messageQuery.filters.title = null;
    }
    loadMessages();
  },
  { deep: true }
);

watch(categories, () => {
  loadMessages();
});

//////////////////

// function loadMyMessages() {
//   load(myMessageQuery).then((res) => {
//     myMessages.splice(0, Infinity);
//     myMessages.push(...res);
//   });
// }

function loadMessages() {
  load(messageQuery).then((res) => {
    messages.splice(0, Infinity);
    messages.push(...res);
  });
}

async function load(query: MessageQuery) {
  loading.value = true;
  try {
    const res: PaginatedResult<Message> =
      await messageManager.getMessages(query);
    return res.data;
  } finally {
    loading.value = false;
  }
}

async function trigger_show_message(message: Message) {
  try {
    bottomPanel.setLoading(true);
    const mes = (await messageManager.getMessage(message.id));
    const tab = {
      title: bottomPanel.getTitle(mes.origin),
      match: /^\/watchlist\/.+\/messages\/[^\/]+([?](.+[=].+[&]?)+)?([\/]{1})?$/g,
      children: [
        {
          title: bottomPanel.getTitle(mes.origin),
          secondTitle: mes.title,
          deletable: false,
          path:`messages/${ mes.id }`,
        },
      ],
      path: `messages/${ mes.id }`,
      const: false,
      deletable: true
    };
    seenMessage(mes)
    bottomPanel.registerTab(tab);
    bottomPanel.activeTab = tab;
    messageManager.message_active = message
    router.push(`/watchlist/${ route.params.name }/messages/${ mes.id }`)
  } catch (e) {
    console.log(e);
  } finally {
    bottomPanel.setLoading(false);
  }
}

function seenMessage(message) {

  const res = messages.find((item)=> item.id === message.id)
  res.seenDate = new Date().toLocaleDateString(locale)
}

loadMessages();
// loadMyMessages();
</script>

<style lang="postcss" scoped>
.l-panel {
  font-size: 0.875rem;
  @apply tw-bg-red-600;

  &::after {
    @apply tw-inset-0 tw-absolute tw-w-full tw-h-full;
    z-index: -1;
    background-color: #fff;
    content: "";
    touch-action: none;
    pointer-events: none;
  }

  .toggle.tabs {
    @apply tw-items-center tw-px-2 tw-shadow-[0_2px_3px_1px] tw-shadow-primary/20;
    padding-top: 8px;
    height: calc(100vh - 42px);
    padding-bottom: 54px;
    min-width: 48px;
    width: 48px;
    max-width: 48px;
    flex-basis: 48px;
  }
  .ada-button,
  .ada-tooltip-container :deep(.ada-button) {
    @apply tw-bg-transparent tw-w-10;

    &.active {
      @apply tw-bg-primary tw-bg-opacity-20 tw-text-primary;

      i {
        @apply tw-text-primary;
      }
    }
  }
  .tab-items {
    width: calc(100% - 48px);
    @apply tw-shadow-[0_2px_3px_1px] tw-shadow-primary/20 tw-py-2 tw-overflow-clip;
    & :deep(.ada-button) {
      @apply tw-bg-transparent;
    }
    .categories {
      @apply tw-px-2 tw-mt-1 tw-select-none tw-flex tw-justify-between tw-items-center;

      span {
        @apply tw-inline-block tw-h-8 tw-px-2 tw-mx-1 tw-rounded-xl tw-cursor-pointer tw-font-semibold;
        line-height: 23.5px;
      }
    }

    .line {
      @apply tw-w-11/12 tw-border-y-gray4 tw-mx-auto;
      border-top-width: 0.5px;
      margin-top: 5px;
    }

    #messages {
      @apply tw-overflow-x-hidden tw-overflow-y-auto tw-border-b-orange-300;
      height: calc(100vh - 109px);
    }
  }
}
</style>

<template>
  <ada-nav
    v-model="drawer"
    min-width="48px"
    max-width="256px"
    :mini="mini"
    mobile-breakpoint="960"
    fixed
    class="l-panel tw-left-0 tw-flex-row-reverse"
  >
    <ada-toggle class="tabs" vertical v-model="toggleMenu">
      <ada-list class="tw-pb-1 tw-overflow-visible">
        <ada-list-item v-for="item in items" :key="item.title" :value="item">
          <template #item="{ value }">
            <ada-btn :model="value.title" @click="$emit('update:mini', !mini)">
              <span v-text="$t(value.title)"></span>
            </ada-btn>
          </template>
        </ada-list-item>
        <ada-list-item value="" class="tw-mt-1">
          <template #item>
            <div>
              <hr class="divider" />
              <ada-tooltip position="right">
                <template #activator>
                  <ada-btn
                    :width="32"
                    :height="32"
                    :model="$t('oms.openingTrade')"
                    @click="$emit('update:mini', !mini)"
                    class="tw-mt-1"
                  >
                    <!-- <span v-text="$t('oms.openingTrade')"></span> -->
                    <ada-icon size="1.5rem">lotfi-calendar-search-1</ada-icon>
                  </ada-btn>
                </template>
                <span v-text="$t('oms.openingTrade')"></span>
              </ada-tooltip>
            </div>
          </template>
        </ada-list-item>
      </ada-list>
    </ada-toggle>
    <ada-tabs class="tab-items" v-model="toggleMenu">
      <!-- <search v-model="searchItem" @update="(val) => searchItem = val" :placeholder="`${$t('user.search')}...`"
        class="tw-text-base tw-px-4 tw-py-3">
        <template #prepend>
          <ada-icon color="primary" class="" :size="14"> isax-search-normal-1 </ada-icon>
        </template>
      </search> -->
      <div class="categories">
        <span
          v-for="category in categories"
          :key="category.title"
          :class="[
            `${category.active ? category.bg + ' ' + category.color : ''}`,
          ]"
          v-text="$t(category.title)"
          @click="
            () => {
              category.active = !category.active;
              if (category.active) origins.push(category.code);
              else origins.splice(origins.indexOf(category.code), 1);
              // loadMyMessages();
              loadMessages();
            }
          "
        ></span>
      </div>
      <div id="messages">
        <div
          v-for="message in messages"
          :key="message.id"
        >
          <hr class="line" />
          <LeftPanelMessageItem
            :id="message.id"
            :dateTime="message.dateTime"
            :title="message.title"
            :preview="message.preview"
            :origin="message.origin"
            :type="message.origin"
            :flags="message.flags"
            :message="message.message.body"
            :seenDate="message.seenDate"
            style="height: 60.1px"
            @triggerShowMessage="trigger_show_message"
          />
        </div>
      </div>
    </ada-tabs>
  </ada-nav>
</template>
