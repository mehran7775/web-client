import { TabItem, OrderFlags } from "@/types";
const panels: Array<TabItem> = [
  {
    title: "bottom-panel.orders.all",
    component: "bottom-panel-defaultOrderList",
    children: [
      {
        path:"orders?offset=0&length=20",
        title: "bottom-panel.orders.all",
        deletable: false,
        match: /^ \/watchlist\/([^/]+?)\/orders-all\?[^/]\w$/g ,
        
      },
      {
        path:`orders?offset=0&length=20&flags=${ OrderFlags.Draft }`,
        title: "bottom-panel.orders.drafts",
        deletable: false,
        match: /^ \/watchlist\/([^/]+?)\/orders-drafts\?[^/]\w$/g ,
        
      },
      {
        path:`orders?offset=0&length=20&flags=${  OrderFlags.Confirmed | OrderFlags.PreOpening | OrderFlags.Created | OrderFlags.Sent }`,
        title: "bottom-panel.orders.actives",
        deletable: false,
        match: /^ \/watchlist\/([^/]+?)\/orders-actives\?[^/]\w$/g ,
        
      },
      {
        path: `orders?offset=0&length=20&flags=${ OrderFlags.Cancelled }`,
        title: "bottom-panel.orders.canceled",
        deletable: false,
        match: /^ \/watchlist\/([^/]+?)\/orders-canceled\?[^/]\w$/g ,
        
      },
    ],
    match: /^ \/watchlist\/([^/]+?)\/orders\?[^/]\w\/?$/g ,
    current: "orders?offset=0&length=20",
    deletable: false,
  },
  {
    title: "bottom-panel.completeInfo.index",
    component: "bottom-panel-furtherInformation",
    children: [
      {
        path:"furtherInformation/depth",
        title: "bottom-panel.furtherInformation.depth",
        deletable: false,
        match: /^ \/watchlist\/([^/]+?)\/furtherInformation-depth\?[^/]\w\/?$/g ,
      },
      {
        path:"furtherInformation/myGroups",
        title: "bottom-panel.furtherInformation.myGroups",
        component: "bottom-panel-furtherInformation-sameSector",
        deletable: false,
        match: /^ \/watchlist\/([^/]+?)\/furtherInformation-myGroups\?[^/]\w\/?$/g ,
      },
      {
        path:"furtherInformation/holdersCombination",
        title: "bottom-panel.furtherInformation.holdersCombination",
        deletable: false,
        match: /^ \/watchlist\/([^/]+?)\/furtherInformation-holdersCombination[\w]\?[^/]\w\/?$/g ,
      },
      {
        path:"furtherInformation/type",
        title: "bottom-panel.furtherInformation.type",
        deletable: false,
        match: /^ \/watchlist\/([^/]+?)\/furtherInformation-type\?[^/]\w\/?$/g ,
      },
    ],
    match: /^ \/watchlist\/([^/]+?)\/furtherInformation-[\w]\?[^/]\w\/?$/g ,
    current: "furtherInformation/depth",
    deletable: false,
  },
  {
    title: "bottom-panel.archive.index",
    match: /^ \/watchlist\/([^/]+?)\/archive-[\w]\?[^/]\w\/?$/g ,
    component: "bottom-panel-archive",
    children: [
      {
        path: "archive-tradesHistory?offset=0&length=20",
        title: "bottom-panel.archive.tradesHistory",
        component:"bottom-panel-archive-tradeHistoryTransactions",
        deletable: false,
        match: /^ \/watchlist\/([^/]+?)\/archive-tradesHistory\?[^/]\w\/?$/g ,
      },
      {
        path: "archive-holdersCompition",
        title: "bottom-panel.archive.holdersCompition",
        deletable: false,
        match: /^ \/watchlist\/([^/]+?)\/archive-holdersCompition\?[^/]\w\/?$/g ,
      },
      {
        path: "archive-type",
        title: "bottom-panel.archive.type",
        deletable: false,
        match: /^ \/watchlist\/([^/]+?)\/archive-type\?[^/]\w\/?$/g ,
      },
    ],
    deletable: false,
    current: "archive-tradesHistory",
  },
  {
    title: "bottom-panel.statisticsKeys.index",
    match: /^ \/watchlist\/([^/]+?)\/statisticsKeys-[\w]\?[^/]\w\/?$/g ,
    children: [
      {
         path: "statisticsKeys-fiveDay",
        title: "bottom-panel.statisticsKeys.fiveDay",
        
        deletable: false,
        match: /^ \/watchlist\/([^/]+?)\/statisticsKeys-fiveDay\?[^/]\w\/?$/g ,
        
      },
      {
         path: "statisticsKeys-threeDay",
        title: "bottom-panel.statisticsKeys.threeDay",
        deletable: false,
        match: /^ \/watchlist\/([^/]+?)\/statisticsKeys-threeDay\?[^/]\w\/?$/g ,
        
      },
    ],
    deletable: false,
    current: "statisticsKeys-fiveDay",
  },
  {
    title: "bottom-panel.more.index",
    match: /^ \/watchlist\/([^/]+?)\/more-[\w]\?[^/]\w\/?$/g ,
    children: [
      {
        path: "more-presentation",
        title: "bottom-panel.more.presentation",
        deletable: false,
        match: /^ \/watchlist\/([^/]+?)\/statisticsKeys-presentation\?[^/]\w\/?$/g ,
        
      },
      {
        path: "more-directorate",
        title: "bottom-panel.more.directorate",
        deletable: false,
        match: /^ \/watchlist\/([^/]+?)\/statisticsKeys-directorate\?[^/]\w\/?$/g ,
      },
    ],
    current: "more-presentation",
    deletable: false,
    component: "lazy-pages-login"
  },
];

export default panels;
