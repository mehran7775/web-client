import { defineStore } from "pinia";
import { DeepOptions, TabItem } from "@/types";
import { WritableComputedRef } from "vue";

export const useBottomPanel = defineStore("bottom-panel", () => {
  const state = ref({
    _activeTab: <string | null>null,
    _expanded: false,
    _tabs: <{ [key: string]: TabItem }>reactive({}),
    _market_depth: <null | { tab: DeepOptions; data: any }>null,
    _loading: false,
  });

  const tabs = computed(() => Object.values(state.value._tabs));
  const activeTab: WritableComputedRef<TabItem | null> = computed({
    set(val: TabItem) {
      state.value._activeTab = val?.title;
    },
    get() {
      return state.value._activeTab
        ? state.value._tabs[state.value._activeTab]
        : null;
    },
  });

  const expanded = computed(() => state.value._expanded);
  const loading = computed(() => state.value._loading);

  function registerTab(tab: TabItem) {
    state.value._tabs[tab.title] = tab;
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
