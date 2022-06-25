<script setup lang="ts">
import { Ref, ref, computed, reactive, watch, useNuxtApp, } from "#app";
import filterAutoComplete from "./filterAutoComplete.vue";
import { AxiosResponse } from "axios";
import { PaginatedResult, Message, MessageFilter, MessageQuery, Tabs } from "@/types";
import MessageList from "./messageList.vue";
import { useAsrTrader, useBottomPanel, useMessages } from "~/composables";

const emit = defineEmits(["openWatchList", "input", "update:mini"]);
const props = defineProps<{ value: boolean; mini: boolean; clipped: boolean }>();
const messageManager = useMessages();
const appManager = useAsrTrader();
const bottomPanel = useBottomPanel();
const rtl = appManager.rtl;
const activeTab: Ref<number | null> = ref(null);

const toggleMenu = ref(null)

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

watch(activeTab, (n, o) => {
  if (typeof n != typeof undefined) emit("update:mini", false);
  else emit("update:mini", true);
});

const items = [
  { title: "general.me" },
  { title: "general.all" },
  // { title: "oms.openingTrade" },
];



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
    bottomPanel.setActiveTab(Tabs.furtherInfo);
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
    <ada-tabs class="tab-items" v-model="activeTab">

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

    /* .tab {
      @apply tw-flex tw-flex-col tw-flex-grow;
      flex-basis: 32px;
      overflow-y: auto;
    } */
  }
}
</style>