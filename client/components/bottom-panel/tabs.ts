import { TabItem, OrderFlags } from "@/types";
const panels: Array<TabItem> = [
  {
    path: "orders-all?offset=0&length=20",
    title: "bottom-panel.orders.all",
    name: "orders",
    component: "bottom-panel-defaultOrderList",
    children: [
      {
        path:"orders-all?offset=0&length=20",
        title: "bottom-panel.orders.all",
        deletable: false,
        name: "orders-all"
      },
      {
        path:`orders-draft?offset=0&length=20&flags=${ OrderFlags.Draft }`,
        title: "bottom-panel.orders.drafts",
        deletable: false,
        name: "orders-draft"
      },
      {
        path:`orders-active?offset=0&length=20&flags=${  OrderFlags.Confirmed | OrderFlags.PreOpening | OrderFlags.Created | OrderFlags.Sent }`,
        title: "bottom-panel.orders.actives",
        deletable: false,
        name: "orders-active"
      },
      {
        path: `orders-canceled?offset=0&length=20&flags=${ OrderFlags.Cancelled }`,
        title: "bottom-panel.orders.canceled",
        deletable: false,
        name: "orders-canceled"
      },
    ],
    current: "orders-all",
    deletable: false,
  },
  {
    path:"completeInfo-depth",
    title: "bottom-panel.completeInfo.index",
    name: "completeInfo",
    component: "bottom-panel-deepInformation",
    children: [
      {
        path:"completeInfo-depth",
        title: "bottom-panel.completeInfo.depth",
        deletable: false,
        name: "completeInfo-depth"
      },
      {
        path:"completeInfo-myGroups",
        title: "bottom-panel.completeInfo.myGroups",
        component: "bottom-panel-deepInformation-sameSector",
        deletable: false,
        name: "completeInfo-myGroups"
      },
      {
        path:"completeInfo-holdersCombination",
        title: "bottom-panel.completeInfo.holdersCombination",
        deletable: false,
        name: "completeInfo-holdersCombination"
      },
      {
        path:"completeInfo-type",
        title: "bottom-panel.completeInfo.type",
        deletable: false,
        name: "completeInfo-type"
      },
    ],
    current: "completeInfo-depth",
    deletable: false,
  },
  {
    path: "archive-tradesHistory",
    title: "bottom-panel.archive.index",
    name: "archive",
    component: "bottom-panel-archive",
    children: [
      {
        path: "archive-tradesHistory?offset=0&length=20",
        title: "bottom-panel.archive.tradesHistory",
        component:"bottom-panel-archive-tradeHistoryTransactions",
        deletable: false,
        name: "archive-tradesHistory"
      },
      {
        path: "archive-holdersCompition",
        title: "bottom-panel.archive.holdersCompition",
        deletable: false,
        name: "archive-holdersCompition"
      },
      {
        path: "archive-type",
        title: "bottom-panel.archive.type",
        deletable: false,
        name: "archive-type"
      },
    ],
    deletable: false,
    current: "archive-tradesHistory",
  },
  {
    path: "statisticsKeys-fiveDay",
    title: "bottom-panel.statisticsKeys.index",
    name: "statisticsKeys",
    children: [
      {
         path: "statisticsKeys-fiveDay",
        title: "bottom-panel.statisticsKeys.fiveDay",
   
        deletable: false,
        name: "statisticsKeys-fiveDay"
      },
      {
         path: "statisticsKeys-threeDay",
        title: "bottom-panel.statisticsKeys.threeDay",
        deletable: false,
        name: "statisticsKeys-threeDay"
      },
    ],
    deletable: false,
    current: "statisticsKeys-fiveDay",
  },
  {
    path: "more-presentation",
    title: "bottom-panel.more.index",
    name: "more",
    children: [
      {
        path: "more-presentation",
        title: "bottom-panel.more.presentation",
        deletable: false,
        name: "more-presentation"
      },
      {
        path: "more-directorate",
        title: "bottom-panel.more.directorate",
        deletable: false,
        name: "more-directorate"
      },
    ],
    current: "more-presentation",
    deletable: false,
    component: "lazy-pages-login"
  },
];

export default panels;
