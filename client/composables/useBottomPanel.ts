import { defineStore } from "pinia";
import { DeepOptions, TabItem } from "@/types";
import { WritableComputedRef } from "vue";
import defaultTabs from "@/components/bottom-panel/tabs";

export const useBottomPanel = defineStore("bottom-panel", () => {
  const state = ref({
    _activeTab: <string | null>null,
    _expanded: false,
    _tabs: <{ [key: string]: TabItem }>reactive({}),
    _market_depth: <null | { tab: DeepOptions; data: any }>null,
    _loading: false,
  });

  for (let i in defaultTabs) {
    registerTab((defaultTabs as Array<TabItem>)[i]);
  }
  


  const tabs = computed(() => Object.values(state.value._tabs));

  const activeTab: WritableComputedRef<TabItem | null> = computed({
    set(val: TabItem) {
      state.value._activeTab = val?.name;
    },
    get() {
      return state.value._activeTab
        ? state.value._tabs[state.value._activeTab]
        : null;
    },
  });

  // const activeChildTab = computed({
  //   get() {
  //     if (activeTab.value && activeTab.value.current) {
  //       return activeTab.value.children.find(q => q.name == activeTab.value.current)
  //     }
  //     return null;
  //   }, set(val) {
  //     activeTab.value.current = val?.name
  //   }
  // });


  const expanded = computed(() => state.value._expanded);
  const loading = computed(() => state.value._loading);

  function registerTab(tab: TabItem) {
    state.value._tabs[tab.name] = tab;
  }
  function toggleExpand() {
    state.value._expanded = !state.value._expanded;
  }
  function setLoading(payload: boolean) {
    state.value._loading = payload;
  }
  function removeTab(tab: TabItem):void {
    state.value._tabs[tab.title] ? delete state.value._tabs[tab.title] : null
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
    tabs,
    activeTab,
    expanded,
    loading
  };
});
