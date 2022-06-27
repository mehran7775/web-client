<script setup lang="ts">
import { Ref, ref, computed, reactive, watch, useNuxtApp, } from "#app";
import filterAutoComplete from "./filterAutoComplete.vue";
import { AxiosResponse } from "axios";
import { PaginatedResult, Message, MessageFilter, MessageQuery, Tabs } from "@/types";
import MessageList from "./messageList.vue";
import { useAsrTrader, useBottomPanel, useMessages } from "~/composables";
import Search from "@/components/search/Search.vue"
import MessageItem from './MessageItem.vue'


const emit = defineEmits(["openWatchList", "input", "update:mini"]);
const props = defineProps<{ value: boolean; mini: boolean; clipped: boolean }>();
const messageManager = useMessages();
const appManager = useAsrTrader();
const bottomPanel = useBottomPanel();
const rtl = appManager.rtl;

const toggleMenu = ref<null | string>(null)

const searchItem = ref<string>('')

const drawer = computed({
  get() {
    return props.value;
  },
  set(value: boolean) {
    emit("input", value);
  },
});
watch(toggleMenu, (newVal, oldVal) => {
  if (typeof newVal == 'undefined' || newVal == null) {
    emit("update:mini", true);
  } else {
    emit("update:mini", false);
  }
})

const loading = ref(false);
const myMessages: Message[] = reactive([]);
const messages: Message[] = reactive([]);

const myMessageQuery: Ref<MessageQuery> = ref(
  new MessageQuery(0, 10, new MessageFilter([], "2019-01-01T00:00:00"))
);

const messageQuery: Ref<MessageQuery> = ref(
  new MessageQuery(0, 10, new MessageFilter([], "2019-01-01T00:00:00"))
);

const items = [
  { title: "general.me" },
  { title: "general.all" },
  // { title: "oms.openingTrade" },
];

const categories = ref<{ title: string, bg: string, color: string, active: boolean }[]>([
  {
    title: 'categories.marketModerator',
    bg: 'tw-bg-primary-100',
    color: 'tw-text-primary',
    active: true
  },
  {
    title: 'categories.codal',
    bg: 'tw-bg-green-100',
    color: 'tw-text-green',
    active: false
  },
  {
    title: 'categories.tedan',
    bg: 'tw-bg-red-100',
    color: 'tw-text-red',
    active: false
  },
  {
    title: 'categories.news',
    bg: 'tw-bg-blue-100',
    color: 'tw-text-blue',
    active: false
  },
])
const messageItems = [ 
  {
    id: 1,
    type:1
  },
  {
    id: 2,
    type:2
  },
  {
    id: 3,
    type:3
  },
  {
    id: 4,
    type:4
  },
  {
    id: 5,
    type:1
  },
   {
    id: 6,
    type:3
  },
   {
    id: 7,
    type:4
  },
   {
    id: 8,
    type:2
  },
   {
    id: 9,
    type:1
  },
]


function loadMyMessages() {
  load(myMessageQuery).then((res) => {
    myMessages.push(...res);
    myMessageQuery.value.offset = messages.length;
  });
}

function loadMessages() {
  load(messageQuery).then((res) => {
    messages.push(...res);
    messageQuery.value.offset = messages.length;
  });
}

async function load(query: Ref<MessageQuery>) {
  loading.value = true;
  try {
    const res: AxiosResponse<PaginatedResult<Message>> = await messageManager.getMessages(
      query.value
    );
    return res.data.data;
  } finally {
    loading.value = false;
  }
}


async function selectMessage(id: number) {
  try {
    bottomPanel.setLoading(true);
    // bottomPanel.setActiveTab(Tabs.furtherInfo);
    const message: Message = (await messageManager.getMessage(id)).data;
    bottomPanel.setMessage(message);
    bottomPanel.setTitle({ tab: Tabs.furtherInfo, title: message.title, params: [] });
  } catch {
    //TODO Snack for error
  } finally {
    bottomPanel.setLoading(false);
  }
}
loadMessages();
loadMyMessages();
</script>

<template>
  <ada-nav v-model="drawer" min-width="48px" max-width="256px" :mini="mini" mobile-breakpoint="960" fixed
    class="l-panel tw-left-0 tw-flex-row-reverse">
    <ada-toggle class="tabs" vertical v-model="toggleMenu">
      <ada-list class="tw-pb-1 tw-overflow-visible">
        <ada-list-item v-for="item in items" :key="item.title" :value="item">
          <template #item="{ value }">
            <ada-btn :width="32" :height="32" color="transparent" :model="value.title"
              @click="$emit('update:mini', !mini)">
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
                  <ada-btn :width="32" :height="32" color="transparent" :model="$t('oms.openingTrade')"
                    @click="$emit('update:mini', !mini)" class="tw-mt-1">
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
      <search v-model="searchItem" @update="(val) => searchItem = val" placeholder="جستوجو..."
        class="tw-text-base tw-px-4 tw-py-3">
        <template #prepend>
          <ada-icon color="primary" class="" :size="14"> isax-search-normal-1 </ada-icon>
        </template>
      </search>
      <div id="categories">
        <span v-for="category in categories" :key="category.title"
          :class="[`${category.active ? category.bg + ' ' + category.color : ''}`]" v-text="$t(category.title)"
          @click="category.active = !category.active"></span>
      </div>
      <div class="tw-overflow-y-auto tw-h-screen">
        <div v-for="item in messageItems" :key="item.id">
          <hr class="line">
          <MessageItem id="1" dateTime="d" title="jkdhg" preview="dgh" origin="5" :type="item.type"
            flags="5" message="gdg" seenDate="g" style="height: 58.9px;"/>
        </div>
      </div>
    </ada-tabs>
  </ada-nav>

</template>


<style lang="postcss" scoped>
.l-panel {
  font-size: 0.875rem;
  padding-top: 42px;
  background-color: rgba(var(--c-primary), 0.01);

  &::after {
    @apply tw-inset-0 tw-absolute tw-w-full tw-h-full;
    z-index: -1;
    background-color: #fff;
    content: '';
    touch-action: none;
    pointer-events: none;
  }

  .toggle.tabs {
    @apply tw-items-center tw-px-2;
    padding-top: 8px;
    height: calc(100vh - 42px);
    padding-bottom: 54px;
    min-width: 48px;
    width: 48px;
    max-width: 48px;
    flex-basis: 48px;
    box-shadow: 2px 1px 6px 0 rgba(var(--c-primary), 0.2);
  }

  .tabs.tab-items {
    min-width: 208px;
    background-color: rgba(var(--c-primary), 0.01);
    width: calc(100% - 48px);


    #categories {
      @apply tw-px-3 tw-mt-1 tw-select-none tw-flex tw-justify-between tw-items-center;

      span {
        @apply tw-px-3 tw-py-2 tw-mx-1 tw-rounded-2xl tw-cursor-pointer tw-font-bold
      }
    }

    .line {
      @apply tw-w-11/12 tw-border-y-gray-200 tw-mx-auto;
       border-top-width: .5px;
       margin-top: 5px;
    }

    /* .tab {
      @apply tw-flex tw-flex-col tw-flex-grow;
      flex-basis: 32px;
      overflow-y: auto;
    } */
  }
}
</style>