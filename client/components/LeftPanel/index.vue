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
          class="message-list"
        />
      </v-tab-item>
      <v-tab-item>
        <filter-auto-complete class="ma-0 pa-0 px-1" />
        <message-list
          v-model="messages"
          :timeFormat="$t('general.date.t')"
          :iconParser="notificationIconParser"
          class="notification-list"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  computed,
  useStore,
  useContext,
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

    const messages: Message[] = reactive([]);

    function notificationIconParser(message: Message): string {
      switch (message.origin) {
        case 1:
          return "mdi-message-cog-outline";
        case 2:
          return "mdi-message-flash-outline";
        case 3:
          return "mdi-message-processing-outline";
        case 4:
          return "mdi-message-alert-outline";
        default:
          return "mdi-message-outline";
      }
    }

    store
      .dispatch(
        "messages/getMessages",
        new MessageQuery(
          0,
          10,
          new MessageFilter([], "2021-09-22T00:00:00.000Z")
        )
      )
      .then((res: AxiosResponse<PaginatedResult<Message>>) => {
        messages.push(...res.data.data);
      })
      .catch();

    return {
      notificationIconParser,
      rtl,
      drawer,
      expand,
      messages,
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
