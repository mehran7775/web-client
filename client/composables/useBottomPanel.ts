import { defineStore } from "pinia";
import { DeepOptions, TabItem, Message } from "@/types";
import { WritableComputedRef, Ref } from "vue";
import defaultTabs from "@/components/bottom-panel/tabs";
import { getMenuItems } from "@/components/rightPanel/items";
import { useMessages } from '~~/composables';

export const useBottomPanel = defineStore("bottom-panel", () => {
  const router = useRouter();
  const route = useRoute();
  const messageManager = useMessages()

  const state = reactive({
    _activeTab: null as TabItem | null,
    _expanded: false,
    _tabs: <{ [key: string]: TabItem }>{},
    _market_depth: <null | { tab: DeepOptions; data: any }>null,
    _loading: false,
    _optionTab: <null | TabItem>null,

  });

  // watch(()=> messageManager.message_active, (newValue)=> {
  //   console.log('message_active', newValue)
  //   console.log(state._tabs[newValue.title])
  // })

  registerTabs()

  const tabs = computed(() => Object.values(state._tabs));

  const activeTab: WritableComputedRef<TabItem | null> = computed({
    set(val: TabItem) {
      if (state._optionTab != null && val != null && !val.const) {
        state._optionTab.const = false;
      }
      if (val?.deletable) {
        val.const = true;
        state._optionTab = val;
      }
      const tab = state._tabs[val?.title]
      if (tab) { tab.const = true; state._activeTab = tab }
      else { state._activeTab = null }
    },
    get() {
      return state._activeTab ?? null
    },
  });

  const expanded = computed(() => state._expanded);
  const loading = computed(() => state._loading);

  function registerTab(tab: TabItem) {
    state._tabs[tab.title] = tab;
  }
  function toggleExpand() {
    state._expanded = !state._expanded;
  }
  function setLoading(payload: boolean) {
    state._loading = payload;
  }
  function removeTab(tab: TabItem): void {
    if (state._tabs[tab.title]) state._tabs[tab.title].const = false
    state._activeTab = null
    router.push(`/watchlist/${route.params.name}`)
  }

  function registerTabs() {
    for (let i in defaultTabs) {
      registerTab((defaultTabs as Array<TabItem>)[i]);
    }
    for (let i in getMenuItems()) {
      registerTab((getMenuItems() as Array<TabItem>)[i]);
    }

    const tabMessage = {
      title: computed(()=> getTitle(messageManager.message_active?.origin)),
      match: /^\/watchlist\/.+\/messages\/[^\/]+([?](.+[=].+[&]?)+)?([\/]{1})?$/g,
      children: [
        {
          path: `messages/${ computed(()=> messageManager.message_active?.id) }`,
          title: computed(()=> getTitle(messageManager.message_active?.origin)),
          secondTitle: computed(()=> messageManager.message_active?.title),
          deletable: false,
          match: /^\/watchlist\/.+\/messages\/[^\/]+([?](.+[=].+[&]?)+)?([\/]{1})?$/g,

        },
      ],
      path: `messages/${ computed(()=> messageManager.message_active?.id) }`,
      deletable: true,
      const: false
    }

    registerTab(tabMessage as any as TabItem)
  }
  function changeTabMessage(message: Message) {
    const tab = state._tabs[message.title]
    console.log('tab',tab)
    tab.title = getTitle(message.origin)
    tab.path = `message/${ message.id }`
    tab.secondTitle = message.title
  }

  function getTitle (type: number) {
    if (type == 1) {
      return "categories.marketModerator";
    } else if (type == 4) {
      return "categories.tedan";
    } else if (type == 5) {
      return "categories.codal";
    } else {
      return "categories.news";
    }
  };



  return {
    state,
    registerTab,
    setLoading,
    toggleExpand,
    removeTab,
    changeTabMessage,
    getTitle,
    tabs,
    activeTab,
    expanded,
    loading,
  };
});
