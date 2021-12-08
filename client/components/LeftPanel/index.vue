<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    :clipped="clipped"
    :right="!rtl"
    class="ps-0 msg-panel"
    width="240"
    fixed
    app
  >
    <v-tabs-items class="messages" v-model="activeTab">
      <v-tab-item>
        <message-list
          v-model="myMessages"
          :timeFormat="$t('general.date.t')"
          :loading="loading"
          @load="loadMyMessages"
          @select="selectMessage"
          class="flex-grow-1"
        />
      </v-tab-item>
      <v-tab-item>
        <filter-auto-complete class="flex-grow-0" />
        <message-list
          v-model="messages"
          :timeFormat="$t('general.date.t')"
          :loading="loading"
          @load="loadMessages"
          @select="selectMessage"
          class="flex-grow-1"
        />
      </v-tab-item>
    </v-tabs-items>
    <v-tabs
      v-model="activeTab"
      class="tabs vertical-tab"
      optional
      vertical
      hide-slider
    >
      <v-tab> {{ $t("general.me") }} </v-tab>
      <v-tab> {{ $t("general.all") }} </v-tab>
    </v-tabs>
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
  watch,
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
    const activeTab: Ref<number | null> = ref(null);

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
    const myMessages: Message[] = reactive([]);
    const messages: Message[] = reactive([]);

    const myMessageQuery: Ref<MessageQuery> = ref(
      new MessageQuery(0, 10, new MessageFilter([], "2019-01-01T00:00:00"))
    );

    const messageQuery: Ref<MessageQuery> = ref(
      new MessageQuery(0, 10, new MessageFilter([], "2019-01-01T00:00:00"))
    );

    watch(activeTab, (n, o) => {
      console.log(n);
      if (typeof n != typeof undefined) context.emit("update:mini", false);
      else context.emit("update:mini", true);
    });

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
        const res: AxiosResponse<PaginatedResult<Message>> =
          await store.dispatch("oms/messages/getMessages", query.value);
        return res.data.data;
      } finally {
        loading.value = false;
      }
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

    loadMessages();
    loadMyMessages();

    return {
      selectMessage,
      messageQuery,
      myMessageQuery,
      loading,
      rtl,
      drawer,
      expand,
      messages,
      myMessages,
      loadMessages,
      loadMyMessages,
      activeTab,
    };
  },
});
</script>

<style lang="sass">
.msg-panel
  overflow: hidden
  padding-top: 4px
  ::-webkit-scrollbar
    display: none
  .v-tabs-items
    background-color: #EEEEEE !important
    height: 100%
    width: calc(100% - 56px)
    display: inline-block
    margin-right: -5px
  .v-tabs
    display: inline-block
    width: 56px
    vertical-align: top
    &--vertical
      > .v-tabs-bar
        .v-tab
          justify-content: center !important
</style>

