import { TabItem, OrderFlags } from "@/types";
const panels: Array<TabItem> = [
  {
    path: "orders-all",
    title: "bottom-panel.orders.all",
    params: {
      offset: 0,
      length: 20,
    },
    component: "bottom-panel-defaultOrderList",
    children: [
      {
        path:"orders-all",
        title: "bottom-panel.orders.all",
        params: {
          offset: 0,
          length: 20,
        },
        deletable: false,
      },
      {
        path:"orders-draft",
        title: "bottom-panel.orders.drafts",
        params: {
          offset: 0,
          length: 20,
          flags: OrderFlags.Draft,
        },
        deletable: false,
      },
      {
        path:"orders-active",
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
        path:"orders-canceled",
        title: "bottom-panel.orders.canceled",
        params: {
          offset: 0,
          length: 20,
          flags: OrderFlags.Cancelled,
        },
        deletable: false,
      },
    ],
    current: "orders-all",
    deletable: false,
  },
  {
    path:"completeInfo-depth",
    title: "bottom-panel.completeInfo.index",
    params: {},
    component: "bottom-panel-deepInformation",
    children: [
      {
        path:"completeInfo-depth",
        title: "bottom-panel.completeInfo.depth",
        params: {},
        deletable: false,
      },
      {
        path:"completeInfo-myGroups",
        title: "bottom-panel.completeInfo.myGroups",
        params: {},
        component: "bottom-panel-deepInformation-sameSector",
        deletable: false,
      },
      {
        path:"completeInfo-holdersCombination",
        title: "bottom-panel.completeInfo.holdersCombination",
        params: {},
        deletable: false,
      },
      {
        path:"completeInfo-type",
        title: "bottom-panel.completeInfo.type",
        params: {},
        deletable: false,
      },
    ],
    current: "completeInfo-depth",
    deletable: false,
  },
  {
    path: "archive-tradesHistory",
    title: "bottom-panel.archive.index",
    params: {},
    component: "bottom-panel-archive",
    children: [
      {
        path: "archive-tradesHistory",
        title: "bottom-panel.archive.tradesHistory",
        params: {
          offset: 0,
          length: 20,
        },
        component:"bottom-panel-archive-tradeHistoryTransactions",
        deletable: false,
      },
      {
        path: "active-holdersCompition",
        title: "bottom-panel.archive.holdersCompition",
        params: {},
        deletable: false,
      },
      {
        path: "active-type",
        title: "bottom-panel.archive.type",
        params: {},
        deletable: false,
      },
    ],
    deletable: false,
    current: "archive-tradesHistory",
  },
  {
    path: "statisticsKeys-fiveDay",
    title: "bottom-panel.statisticsKeys.index",
    params: {},
    children: [
      {
        
         path: "statisticsKeys-fiveDay",
        title: "bottom-panel.statisticsKeys.fiveDay",
        params: {},
        deletable: false,
      },
      {
         path: "statisticsKeys-threeDay",
        title: "bottom-panel.statisticsKeys.threeDay",
        params: {},
        deletable: false,
      },
    ],
    deletable: false,
    current: "statisticsKeys-fiveDay",
  },
  {
    path: "more-presentation",
    title: "bottom-panel.more.index",
    params: {},
    children: [
      {
        path: "more-presentation",
        title: "bottom-panel.more.presentation",
        params: {},
        deletable: false,
      },
      {
        path: "more-directorate",
        title: "bottom-panel.more.directorate",
        params: {},
        deletable: false,
      },
    ],
    current: "more-presentation",
    deletable: false,
    component: "lazy-pages-login"
  },
];

export default panels;
