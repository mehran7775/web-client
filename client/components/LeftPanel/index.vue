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
  { title: "oms.openingTrade" },
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

<!-- <style lang="postcss">
.msg-panel {
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden;
  &.v-navigation-drawer--mini-variant {
    width: 48px !important;
  }
  .v-navigation-drawer__content {
    display: flex;
    flex-direction: row;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .v-tabs-items {
    background-color: #eeeeee !important;
    height: 100%;
    overflow-y: auto;
    width: calc(100% - 48px);
    display: block;
    .tab-item {
      width: 100%;
      white-space: nowrap;
      transform: translateX(100%);
      height: 0;
      &.active {
        transition: transform 0.5s ease-in-out;
        animation: slide-in 0.5s forwards;
        transform: translateX(0%);
        height: 100%;
      }
    }
  }
  .v-tabs {
    vertical-align: top;
    max-width: 48px;
    .v-tab {
      margin: 0;
      padding: 0;
      max-width: 48px;
      min-width: 48px;
      justify-content: center !important;
      white-space: normal;
    }
  }
}
</style> -->

<template>
  <!-- 
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    :clipped="clipped"
    :right="!rtl"
    class="ps-0 msg-panel"
    width="152"
    mobile-breakpoint="960"
    fixed
    app
  >
    <div class="v-tabs-items">
      <message-list
        @load="loadMyMessages"
        @select="selectMessage"
        v-model="v"
        :class="{
          'tab-item': true,
          active: 0 == activeTab,
        }"
      >
      </message-list>
      <message-list
        @load="loadMessages"
        @select="selectMessage"
        v-model="messages"
        :class="{
          'tab-item': true,
          active: 1 == activeTab,
        }"
      >
      </message-list>
    </div>
    <v-tabs v-model="activeTab" hide-slider optional vertical>
      <v-tab
        v-for="item in items"
        :key="item.title"
        @click="
          () => {
            $emit('closeRightPanel')
            $emit('update:mini', !mini);
          }
        "
      >
        {{ $t(item.title) }}v
      </v-tab>
    </v-tabs>
  </v-navigation-drawer> -->

  <ada-nav v-model="drawer" min-width="48px" max-width="152px" :mini="mini" mobile-breakpoint="960" fixed
    class="l-panel tw-left-0">
    <ada-toggle class="tabs" vertical>
      <ada-list>
        <ada-list-item v-for="item in items" :key="item.title" :value="item">
          <template #item="{ value }">
            <div class="tw-w-full tw-flex tw-justify-between tw-items-center" 
              @click="
              () => {
                $emit('update:mini', !mini);
              }"
            >
              <span v-text="$t(value.title)"></span>
            </div>
          </template>
        </ada-list-item>
      </ada-list>
    </ada-toggle>

  </ada-nav>

</template>


<style lang="postcss" scoped>
.l-panel {
  font-size: 0.875rem;
  padding-top: 42px;
  background-color: rgba(var(--c-primary), 0.01);
  background-color: aqua;

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
    box-shadow: -2px 1px 2px 0 rgba(var(--c-primary), 0.2);

    .icon {
      font-size: 1.5rem;
    }
  }
}
</style>