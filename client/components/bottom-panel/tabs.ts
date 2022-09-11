import { TabItem, OrderFlags } from "@/types";
const panels: Array<TabItem> = [
  {
    title: "bottom-panel.orders.all",
    params: {},
    component: "bottom-panel-defaultOrderList",
    children: [
      {
        title: "bottom-panel.orders.all",
        params: {
          offset: 0,
          length: 20,
        },
        deletable: false,
      },
      {
        title: "bottom-panel.orders.drafts",
        params: {
          offset: 0,
          length: 20,
          flags: OrderFlags.Draft,
        },
        deletable: false,
      },
      {
        title: "bottom-panel.orders.actives",
        params: {
          offset: 0,
          length: 20,
          flags:
            OrderFlags.Confirmed |
            OrderFlags.PreOpening |
            OrderFlags.Created |
            OrderFlags.Sent,
        },
        deletable: false,
      },
      {
        title: "bottom-panel.orders.canceled",
        params: {
          offset: 0,
          length: 20,
          flags: OrderFlags.Cancelled,
        },
        deletable: false,
      },
    ],
    current: "bottom-panel.orders.all",
    deletable: false,
  },
  {
    title: "bottom-panel.completeInfo.index",
    params: {},
    component: "bottom-panel-deepInformation",
    children: [
      {
        title: "bottom-panel.completeInfo.depth",
        params: {},
        deletable: false,
      },
      {
        title: "bottom-panel.completeInfo.myGroups",
        params: {},
        component: "bottom-panel-deepInformation-sameSector",
        deletable: false,
      },
      {
        title: "bottom-panel.completeInfo.holdersCombination",
        params: {},
        deletable: false,
      },
      {
        title: "bottom-panel.completeInfo.type",
        params: {},
        deletable: false,
      },
    ],
    current: "bottom-panel.completeInfo.depth",
    deletable: false,
  },
  {
    title: "bottom-panel.archive.index",
    params: {},
    component: "bottom-panel-archive",
    children: [
      {
        title: "bottom-panel.archive.tradesHistory",
        params: {
          offset: 0,
          length: 20,
        },
        component:"bottom-panel-archive-tradeHistoryTransactions",
        deletable: false,
      },
      {
        title: "bottom-panel.archive.holdersCompition",
        params: {},
        deletable: false,
      },
      {
        title: "bottom-panel.archive.type",
        params: {},
        deletable: false,
      },
    ],
    deletable: false,
    current: "bottom-panel.archive.tradesHistory",
  },
  {
    title: "bottom-panel.statisticsKeys.index",
    params: {},
    children: [
      {
        title: "bottom-panel.statisticsKeys.fiveDay",
        params: {},
        deletable: false,
      },
      {
        title: "bottom-panel.statisticsKeys.threeDay",
        params: {},
        deletable: false,
      },
    ],
    deletable: false,
    current: "bottom-panel.statisticsKeys.fiveDay",
  },
  {
    title: "bottom-panel.more.index",
    params: {},
    children: [
      {
        title: "bottom-panel.more.presentation",
        params: {},
        deletable: false,
      },
      {
        title: "bottom-panel.more.directorate",
        params: {},
        deletable: false,
      },
    ],
    current: "bottom-panel.more.presentation",
    deletable: false,
    component: "lazy-pages-login"
  },
];

export default panels;
