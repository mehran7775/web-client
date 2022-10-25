import { defineStore } from "pinia";
import { DeepOptions, TabItem } from "@/types";
import { WritableComputedRef } from "vue";
import defaultTabs from "@/components/bottom-panel/tabs";
import { getMenuItems } from "@/components/rightPanel/items";

export const useBottomPanel = defineStore("bottom-panel", () => {
  const router = useRouter();
  const route = useRoute();
  const state = reactive({
    _activeTab: <string | null>null,
    _expanded: false,
    _tabs: <{ [key: string]: TabItem }>reactive({}),
    _optionsTabs : <{ [key: string]: TabItem }>reactive({}),
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
        name: i.name,
        icon: i.icon,
        component: i.component ?? '',
        deleteAble: false,
      });
    });
    const tab: TabItem = {
      title: t.title,
      path: t.to ,
      name: t.name,
      deletable: true,
      children: childrens,
      current: t.children ? t.children[0].name : ''
    };
    state._optionsTabs[tab.name]= tab
  });

  const tabs = computed(() => Object.values(state._tabs));
  const optionsTabs = computed(() => Object.values(state._optionsTabs));

  const activeTab: WritableComputedRef<TabItem | null> = computed({
    set(val: TabItem) {
      state._activeTab = val?.name;
    },
    get() {
      return state._activeTab
        ? state._tabs[state._activeTab]
        : null;
    },
  });

  const expanded = computed(() => state._expanded);
  const loading = computed(() => state._loading);

  function registerTab(tab: TabItem) {
    state._tabs[tab.name] = tab;
  }
  function toggleExpand() {
    state._expanded = !state._expanded;
  }
  function setLoading(payload: boolean) {
    state._loading = payload;
  }
  function removeTab(tab: TabItem): void {
    if(state._tabs[tab.name] ) delete state._tabs[tab.name]
    router.push(`/watchlist/${ route.params.name }`)
  }
  function removeOptionTab(tab: TabItem): void {
    if(state._tabs[tab.name] ) delete state._tabs[tab.name]
  }
  function assignTab(item) {
    if(route.params.slug == item.to) return 
    if(existDeletableTab()) removeOptionTab(existDeletableTab()) 
    let obj = [];
    item.children?.forEach((i) => {
      obj.push({
        title: i.title,
        path: i.to,
        name: i.name ?? '',
        icon: i.icon,
        deleteAble: false,
      });
    });
    const tab: TabItem = {
      title: item.title,
      path: item.to,
      name: item.name ?? '',
      deletable: true,
      children: obj,
      current: item.children ? item.children[0].to: item.title,
    };
    router.push(`/watchlist/${route.params.name}/${tab.current}`)
    
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
    optionsTabs,
    tabs,
    activeTab,
    expanded,
    loading,
  };
});
