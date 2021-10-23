<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    :clipped="clipped"
    :right="!rtl"
    class="ma-0 pa-0"
    width="260"
    absolute
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
import { PaginatedResult, Message, MessageFilter, MessageQuery } from "@/types";
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

    const messageQuery: Ref<MessageQuery> = ref(new MessageQuery(
      0,
      10,
      new MessageFilter([], "2021-09-22T00:00:00.000Z")
    ));

    function loadMessages(query: MessageQuery) {
      loading.value = true;
      store
        .dispatch("messages/getMessages", query)
        .then((res: AxiosResponse<PaginatedResult<Message>>) => {
          messages.push(...res.data.data);
          messageQuery.value.offset = messages.length
        })
        .catch()
        .finally(() => {
          loading.value = false;
        });
    }

    loadMessages(messageQuery.value);

    return {
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
