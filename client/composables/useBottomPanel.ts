import { defineStore } from "pinia";
import {
  Tabs,
  DeepOptions,
  TabItem,
  SameSectorQuery,
  Message,
} from "@/types";
import { useSectors } from ".";

let TabNames =[
  {
    tab: Tabs.activeOrders,
    title: "bottom-panel.orders.all",
    params: [],
    children: [
      {
        title: "bottom-panel.orders.all",
        params: [],
      },
      {
        title: "bottom-panel.orders.drafts",
        params: [],
      },
      {
        title: "bottom-panel.orders.actives",
        params: [],
      },
      {
        title: "bottom-panel.orders.canceled",
        params: [],
      },
    ],
    default: "bottom-panel.orders.all",
  },
  {
    tab: Tabs.completeInfo,
    title: "bottom-panel.completeInfo.index",
    params: [],
    children: [
      {
        title: "bottom-panel.completeInfo.depth",
        params: [],
      },
      {
        title: "bottom-panel.completeInfo.myGroups",
        params: [],
      },
      {
        title: "bottom-panel.completeInfo.holdersCombination",
        params: [],
      },
      {
        title: "bottom-panel.completeInfo.type",
        params: [],
      },
    
    ],
    default: "bottom-panel.completeInfo.depth",
  },
  {
    tab: Tabs.dateInfo,
    title: "bottom-panel.dateInfo.index",
    params: [],
    children: [
      {
        title: "bottom-panel.dateInfo.tradesHistory",
        params: [],
      },
      {
        title: "bottom-panel.dateInfo.holdersCompition",
        params: [],
      },
      {
        title: "bottom-panel.dateInfo.type",
        params: [],
      },
    ],
    default: "bottom-panel.dateInfo.tradesHistory",
  },
  {
    tab: Tabs.statisticsKeys,
    title: "bottom-panel.statisticsKeys.index",
    params: [],
    children: [
      {
        title: "bottom-panel.statisticsKeys.fiveDay",
        params: [],
      },
      {
        title: "bottom-panel.statisticsKeys.threeDay",
        params: [],
      },
    ],
    default: "bottom-panel.statisticsKeys.fiveDay",
  },
  {
    tab: Tabs.furtherInfo,
    title: "bottom-panel.more.index",
    params: [],
    children: [
      {
        title: "bottom-panel.more.presentation",
        params: [],
      },
      {
        title: "bottom-panel.more.directorate",
        params: [],
      },
    ],
    default: "bottom-panel.more.presentation",
  },
];


export const useBottomPanel = defineStore("bottom-panel", {
  state: () => ({
    _activeTab: <TabItem | null>null,
    _expanded: false,
    _titles: <TabItem[]>TabNames,
    _further_information: <Message>{
      flags: 0,
      title: "",
      message: {},
      origin: 1,
      type: 1,
    },
    _market_depth: <null | { tab: DeepOptions; data: any }>null,
    _the_bests: {},
    _orders: {},
    _loading: false,
  }),
  getters: {
    tabs: (state): Array<TabItem> => state._titles,
    activeTab: (state): TabItem | null => state._activeTab,
    expanded: (state) => state._expanded,
    loading: (state) => state._loading,
    further_information: (state): Message => state._further_information,
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
        //TODO go to team mates
        //this.setActiveTab(Tabs.depth);
      }
    },
    setActiveTab(payload: TabItem | null) {
      this._activeTab = payload;
    },
    toggleExpand() {
      this._expanded = !this.expanded;
    },
    setMessage(payload: Message) {
      this._further_information = payload;
    },
    setDepthData(payload: null | { tab: DeepOptions; data: any }) {
      this._market_depth = payload;
    },
    setLoading(payload: boolean) {
      this._loading = payload;
    },
    
  },
});
