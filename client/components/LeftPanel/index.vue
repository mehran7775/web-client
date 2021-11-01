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
    <v-tabs
      v-model="activeTab"
      height="40"
      class="ma-0 pa-0 px-1 flex-grow-0"
      grow
    >
      <v-tab> {{ $t("general.me") }} </v-tab>
      <v-tab> {{ $t("general.all") }} </v-tab>
    </v-tabs>
    <v-tabs-items class="messages" v-model="activeTab">
      <v-tab-item> </v-tab-item>
      <v-tab-item>
        <filter-auto-complete class="flex-grow-0" />
        <message-list
          v-model="messages"
          :timeFormat="$t('general.date.t')"
          :loading="loading"
          @load="loadMessages(messageQuery)"
          @select="selectMessage"
          class="flex-grow-1"
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
      new MessageQuery(0, 10, new MessageFilter([], "2019-01-01T00:00:00"))
    );

    function loadMessages(query: MessageQuery) {
      loading.value = true;
      store
        .dispatch("oms/messages/getMessages", query)
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
        store.commit("bottom-panel/setActiveTab", Tabs.furtherInfo);
        const message: Message = (
          await store.dispatch("oms/messages/getMessage", id)
        ).data;
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
.messages {
  height: calc(100% - 40px);
  overflow-y: auto;
}
</style>
<style>
.messages .v-window-item {
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
}
</style>