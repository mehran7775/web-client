<template>
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
        v-model="myMessages"
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
            $emit('update:mini', !mini);
          }
        "
      >
        {{ $t(item.title) }}
      </v-tab>
    </v-tabs>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {
  defineComponent,
  Ref,
  ref,
  computed,
  reactive,
  watch,
} from "@vue/composition-api";
import filterAutoComplete from "./filterAutoComplete.vue";
import { AxiosResponse } from "axios";
import {
  PaginatedResult,
  Message,
  MessageFilter,
  MessageQuery,
  Tabs,
  TabTitle,
} from "@/types";
import MessageList from "./messageList.vue";
import { useAsrTrader } from "~/composables";
import { useNuxtApp } from "#app";

export default defineComponent({
  components: { filterAutoComplete, MessageList },
  name: "right-panel",
  emits: ["openWatchList"],
  props: {
    value: Boolean,
    mini: Boolean,
    clipped: Boolean,
  },
  setup(props, context) {
    const { $store: store } = useNuxtApp();
    const appManager = useAsrTrader(store);
    const rtl = appManager.rtl;
    const activeTab: Ref<number | null> = ref(null);

    const drawer = computed({
      get() {
        return props.value;
      },
      set(value: boolean) {
        context.emit("input", value);
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
      if (typeof n != typeof undefined) context.emit("update:mini", false);
      else context.emit("update:mini", true);
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
        const res: AxiosResponse<PaginatedResult<Message>> = await store.dispatch(
          "oms/messages/getMessages",
          query.value
        );
        return res.data.data;
      } finally {
        loading.value = false;
      }
    }

    async function selectMessage(id: number) {
      try {
        store.commit("bottom-panel/setLoading", true);
        store.commit("bottom-panel/setActiveTab", Tabs.furtherInfo);
        const message: Message = (await store.dispatch("oms/messages/getMessage", id))
          .data;
        store.commit("bottom-panel/setMessage", message);
        store.commit(
          "bottom-panel/setTitle",
          new TabTitle(Tabs.furtherInfo, message.title)
        );
      } catch {
        //TODO Snack for error
      } finally {
        store.commit("bottom-panel/setLoading", false);
      }
    }

    loadMessages();
    loadMyMessages();

    return {
      selectMessage,
      messageQuery,
      myMessageQuery,
      loading,
      rtl,
      drawer,
      items,
      messages,
      myMessages,
      loadMessages,
      loadMyMessages,
      activeTab,
    };
  },
});
</script>

<style lang="postcss">
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
      min-width: 48px;
      max-width: 48px;
      justify-content: center !important;
      white-space: normal;
    }
  }
}
</style>
