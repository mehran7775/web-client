<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    :clipped="clipped"
    :right="!rtl"
    class="ma-0 pa-0"
    width="260"
    fixed
    app
  >
    <v-tabs v-model="activeTab" height="28" class="ma-0 pa-0 px-1" grow>
      <v-tab> {{ $t("general.me") }} </v-tab>
      <v-tab> {{ $t("general.all") }} </v-tab>
    </v-tabs>
    <v-tabs-items v-model="activeTab">
      <v-tab-item>
        <message-list
          v-model="messages"
          :timeFormat="$t('general.date.d')"
          :loading="loading"
          @load="loadMessages(messageQuery)"
          @select="selectMessage"
          class="message-list"
        />
      </v-tab-item>
      <v-tab-item>
        <filter-auto-complete class="ma-0 pa-0 px-1" />
        <message-list
          v-model="messages"
          :timeFormat="$t('general.date.t')"
          :loading="loading"
          @load="loadMessages(messageQuery)"
          @select="selectMessage"
          class="notification-list"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {
  defineComponent,
  Ref,
  ref,
  computed,
  useStore,
  reactive,
} from "@nuxtjs/composition-api";
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
    const store = useStore();
    const rtl = computed(() => store.getters["rtl"]);

    const expand = ref(true);
    const drawer = computed({
      get() {
        return props.value;
      },
      set(value: boolean) {
        context.emit("input", value);
      },
    });

    const loading = ref(false);
    const messages: Message[] = reactive([]);

    const messageQuery: Ref<MessageQuery> = ref(
      new MessageQuery(0, 10, new MessageFilter([], "2021-09-22T00:00:00.000Z"))
    );

    function loadMessages(query: MessageQuery) {
      loading.value = true;
      store
        .dispatch("messages/getMessages", query)
        .then((res: AxiosResponse<PaginatedResult<Message>>) => {
          messages.push(...res.data.data);
          messageQuery.value.offset = messages.length;
        })
        .catch()
        .finally(() => {
          loading.value = false;
        });
    }

    async function selectMessage(id: number) {
      try {
        store.commit("bottom-panel/setLoading", true);
        const message: Message = (
          await store.dispatch("messages/getMessage", id)
        ).data;
        store.commit("bottom-panel/setMessage", message);
        store.commit(
          "bottom-panel/setTitle",
          new TabTitle(Tabs.furtherInfo, message.title)
        );
        // Should be the last to commit
        store.commit("bottom-panel/setActiveTab", Tabs.furtherInfo);
      } catch{
        //TODO Snack for error
      } finally{
        store.commit("bottom-panel/setLoading", false);
      }
    }

    loadMessages(messageQuery.value);

    return {
      selectMessage,
      messageQuery,
      loading,
      rtl,
      drawer,
      expand,
      messages,
      loadMessages,
      activeTab: 0,
    };
  },
});
</script>

<style scoped>
.message-list {
  display: block;
  height: calc(100vh - 124px);
  overflow-x: hidden;
  overflow-y: auto;
}
.notification-list {
  display: block;
  height: calc(100vh - 152px);
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
