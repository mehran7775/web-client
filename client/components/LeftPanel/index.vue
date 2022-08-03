<script setup lang="ts">
import { Ref, ref, computed, reactive, watch, useNuxtApp, } from "#app";
import filterAutoComplete from "./filterAutoComplete.vue";
import { AxiosResponse } from "axios";
import { PaginatedResult, Message, MessageFilter, MessageQuery, Tabs } from "@/types";
import MessageList from "./messageList.vue";
import { useAsrTrader, useBottomPanel, useMessages, useInstrument } from "~/composables";
import MessageItem from './MessageItem.vue'


const emit = defineEmits(["openWatchList", "input", "update:mini"]);
const props = defineProps<{ value: boolean; clipped: boolean }>();
const messageManager = useMessages();
const appManager = useAsrTrader();
const instrumentManager = useInstrument();
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

const loading = ref(false);
const myMessages: Message[] = reactive([]);
const messages: Message[] = reactive([]);
const origins: Array<'RLC' | 'SUPPORT' | 'ADMIN' | 'TEDAN' | 'CODAL' | 'NEWS'> = ['RLC']

const selected = computed(() => instrumentManager.state.selected)
const mini = computed({
  get() {
    return bottomPanel.LeftPanelMini;
  },
  set(val) {
    bottomPanel.LeftPanelMini = val
  }
});

const myMessageQuery: Ref<MessageQuery> = ref(
  new MessageQuery(0, 10, new MessageFilter([], "2019-01-01T00:00:00", null))
);

const messageQuery: Ref<MessageQuery> = ref(
  new MessageQuery(0, 10, new MessageFilter([], "2019-01-01T00:00:00", null))
);

myMessageQuery.value.filters.origins = origins;
messageQuery.value.filters.origins = origins;

const items = [
  { title: "general.me" },
  { title: "general.all" },
  // { title: "oms.openingTrade" },
];

const categories = ref<{ title: string, bg: string, color: string, active: boolean, code: string }[]>([
  {
    title: 'categories.marketModerator',
    bg: 'tw-bg-primary-100',
    color: 'tw-text-primary',
    active: true,
    code: 'RLC'
  },
  {
    title: 'categories.codal',
    bg: 'tw-bg-green-100',
    color: 'tw-text-green',
    active: false,
    code: 'CODAL'
  },
  {
    title: 'categories.tedan',
    bg: 'tw-bg-red-100',
    color: 'tw-text-red',
    active: false,
    code: 'TEDAN'
  },
  {
    title: 'categories.news',
    bg: 'tw-bg-blue-100',
    color: 'tw-text-blue',
    active: false,
    code: 'NEWS'
  },
])


/////

watch(toggleMenu, (newVal, oldVal) => {
  if (typeof newVal == 'undefined' || newVal == null) {
    mini.value = true;

  } else {
    mini.value = false;
  }
})

watch(selected, (newval) => {
  if (newval) {
    myMessageQuery.value.filters.title = "(" + newval?.name;
    messageQuery.value.filters.title = "(" + newval?.name;
  } else {
    myMessageQuery.value.filters.title = null;
    messageQuery.value.filters.title = null;
  }
  loadMyMessages();
  loadMessages();
})





//////////////////

function loadMyMessages() {
  load(myMessageQuery).then((res) => {
    myMessages.splice(0, Infinity);
    myMessages.push(...res);
    //myMessageQuery.value.offset = messages.length;
  });
}

function loadMessages() {
  load(messageQuery).then((res) => {
    messages.splice(0, Infinity);
    messages.push(...res);
    //messageQuery.value.offset = messages.length;
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

const trigger_show_message = async (message: any) => {
  const tab = useBottomPanel()._titles.find(item => {
    return item.title == getTitle(message.type)
  })
  if (tab) {
    const res = useBottomPanel()._titles.filter(item => {
      return item.title != tab.title
    })
    useBottomPanel()._titles = res
  }
  const item = {
    title: getTitle(message.type),
    body: message.message,
    params: [],
    children: [
      {
        title: getTitle(message.type),
        title2: message.title,
        params: [],
      },

    ],
    default: `${getTitle(message.type)}`,
    deleteAble: true
  }
  useBottomPanel()._titles.push(item)
  useBottomPanel()._activeTab = item

}

const getTitle = (type: number) => {
  if (type === 1) {
    return 'categories.marketModerator'
  } else if (type === 4) {
    return 'categories.tedan'
  } else if (type === 5) {
    return 'categories.codal'
  } else {
    return 'categories.news'
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
      <!-- <search v-model="searchItem" @update="(val) => searchItem = val" :placeholder="`${$t('user.search')}...`"
        class="tw-text-base tw-px-4 tw-py-3">
        <template #prepend>
          <ada-icon color="primary" class="" :size="14"> isax-search-normal-1 </ada-icon>
        </template>
      </search> -->
      <div class="categories">
        <span v-for="category in categories" :key="category.title"
          :class="[`${category.active ? category.bg + ' ' + category.color : ''}`]" v-text="$t(category.title)" @click="() => {
            category.active = !category.active
            if (category.active) origins.push(category.code)
            else origins.splice(origins.indexOf(category.code), 1)
            loadMyMessages()
            loadMessages()
          }"></span>
      </div>
      <div id="messages">
        <div v-for="message in  toggleMenu == 'general.all' ? messages : myMessages" :key="message.id">
          <hr class="line">
          <MessageItem :id="message.id" :dateTime="message.dateTime" :title="message.title" :preview="message.preview"
            :origin="message.origin" :type="message.origin" :flags="message.flags" :message="message.message.body"
            :seenDate="message.seenDate" style="height: 58.9px;" @click="trigger_show_message" />
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


    .categories {
      @apply tw-px-3 tw-mt-1 tw-select-none tw-flex tw-justify-between tw-items-center;
      height: 32px;

      span {
        @apply tw-px-3 tw-py-2 tw-mx-1 tw-rounded-2xl tw-cursor-pointer tw-font-semibold;
      }
    }

    .line {
      @apply tw-w-11/12 tw-border-y-divider tw-mx-auto;
      border-top-width: .5px;
      margin-top: 5px;
    }

    #messages {
      @apply tw-overflow-x-hidden tw-overflow-y-auto tw-border-b-orange-300;
      height: calc(100vh - 109px);
    }


  }
}
</style>