import { defineStore } from "pinia";
import {
  Tabs,
  TabNames,
  DeepOptions,
  TabTitle,
  SameSectorQuery,
  Message,
} from "@/types";
import { useSectors } from ".";

export const useBottomPanel = defineStore("bottom-panel", {
  state: () => ({
    _activeTab: <Tabs>Tabs.none,
    _expanded: false,
    _titles: <TabTitle[]>TabNames(),
    _further_information: <Message>{
      flags: 0,
      title: "",
      message: {},
      origin: 1,
      type:1
    },
    _market_depth: <null | { tab: DeepOptions; data: any }>null,
    _the_bests: {},
    _orders: {},
    _loading: false,
  }),
  getters: {
    activeTab: (state): Tabs => state._activeTab,
    expanded: (state) => state._expanded,
    loading: (state) => state._loading,
    further_information: (state): Message => state._further_information,
    title: (state): TabTitle => state._titles[state._activeTab],
    market_depth: (state) => state._market_depth,
  },
  actions: {
    async getTeammates(payload: SameSectorQuery) {
      const sectors = useSectors();
      const sector = await sectors.getSector(payload.sector);
      if (sector) {
        this.setTitle({
          tab: Tabs.depth,
          title: "bottom-panel." + DeepOptions.teammates,
          params: [sector.name],
        });
        const data = await this.getTeammates(payload);
        this.setDepthData({
          tab: DeepOptions.teammates,
          data: data,
        });
        this.setActiveTab(Tabs.depth);
      }
    },
    setActiveTab(payload: Tabs) {
      this._activeTab = payload;
    },
    toggleExpand() {
      this._expanded = !this.expanded;
    },
    setMessage(payload: Message) {
      this._further_information = payload;
    },
    setTitle(payload: TabTitle) {
      Object.assign(this._titles[payload.tab], payload);
    },
    setDepthData(payload: null | { tab: DeepOptions; data: any }) {
      this._market_depth = payload;
    },
    setLoading(payload: boolean) {
      this._loading = payload;
    },
  },
});
