import { defineStore } from "pinia";
import { DeepOptions, TabItem } from "@/types";
import { WritableComputedRef } from "vue";
import defaultTabs from "@/components/bottom-panel/tabs";
import { getMenuItems } from "@/components/rightPanel/items";

export const useBottomPanel = defineStore("bottom-panel", () => {
  const router = useRouter();
  const route = useRoute();
  const state = reactive({
    _activeTab: null as TabItem | null,
    _expanded: false,
    _tabs: <{ [key: string]: TabItem }>reactive({}),
    _market_depth: <null | { tab: DeepOptions; data: any }>null,
    _loading: false,
  });

  for (let i in defaultTabs) {
    registerTab((defaultTabs as Array<TabItem>)[i]);
  }

  getMenuItems().forEach((t) => {
    let childrens = [];
    if(t.children) t.children?.forEach((i) => {
      childrens.push({
        title: i.title,
        path: i.to,
        icon: i.icon,
        match: i.match,
        deleteAble: false,
      });
    });
    const tab: TabItem = {
      title: t.title,
      deletable: true,
      children: childrens,
      match: t.match,
      current: t.children ? t.children[0].to : '',
      const: false
    };
    state._tabs[tab.title]= tab
  });

  const tabs = computed(() => Object.values(state._tabs).filter( item => item.const ));

  const activeTab: WritableComputedRef<TabItem | null> = computed({
    set(val: TabItem) {
      const tab = state._tabs[val?.title]
      if(tab) { tab.const = true; state._activeTab = tab }
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
    if(state._tabs[tab.title] ) state._tabs[tab.title].const = false
    state._activeTab = null
    router.push(`/watchlist/${ route.params.name }`)
  }
  function removeOptionTab(tab: TabItem): void {
    if(state._tabs[tab.title] ) state._tabs[tab.title].const = false
  }
  function assignTab(item) {
    if(existDeletableTab()) removeOptionTab(existDeletableTab()) 
    router.push(`/watchlist/${route.params.name}/${ state._tabs[item.title].current }`)
    state._tabs[item.title].const = true
  }

  const existDeletableTab = (): TabItem | undefined => {
    return tabs.value.find((item) => item.deletable === true);
  };

  return {
    state,
    registerTab,
    setLoading,
    toggleExpand,
    removeTab,
    existDeletableTab,
    assignTab,
    tabs,
    activeTab,
    expanded,
    loading,
  };
});
