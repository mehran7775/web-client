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
        match: /^\/watchlist\/.+\/orders([?]((((?!flags)[^=\/&]+=[^\/&]+)|(flags=(?!1|8|54)[^\/&]+))[&]?)*([\/]{1})?)$/g ,
        
      },
      {
        path:`orders?offset=0&length=20&flags=${ OrderFlags.Draft }`,
        title: "bottom-panel.orders.drafts",
        deletable: false,
        match: /^\/watchlist\/.+\/orders([?]((((?!flags)[^=\/&]+=[^\/&]+)|(flags=1))[&]?)*([\/]{1})?)$/g ,
        
      },
      {
        path:`orders?offset=0&length=20&flags=${  OrderFlags.Confirmed | OrderFlags.PreOpening | OrderFlags.Created | OrderFlags.Sent }`,
        title: "bottom-panel.orders.actives",
        deletable: false,
        match: /^\/watchlist\/.+\/orders([?]((((?!flags)[^=\/&]+=[^\/&]+)|(flags=54))[&]?)*([\/]{1})?)$/g ,
        
      },
      {
        path: `orders?offset=0&length=20&flags=${ OrderFlags.Cancelled }`,
        title: "bottom-panel.orders.canceled",
        deletable: false,
        match: /^\/watchlist\/.+\/orders([?]((((?!flags)[^=\/&]+=[^\/&]+)|(flags=8))[&]?)*([\/]{1})?)$/g ,
        
      },
    ],
    match: /^\/watchlist\/.+\/orders([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
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
        match: /^\/watchlist\/.+\/furtherInformation\/depth([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
      },
      {
        path:"furtherInformation/myGroups",
        title: "bottom-panel.furtherInformation.myGroups",
        component: "bottom-panel-furtherInformation-sameSector",
        deletable: false,
        match: /^\/watchlist\/.+\/furtherInformation\/myGroups([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
      },
      {
        path:"furtherInformation/holdersCombination",
        title: "bottom-panel.furtherInformation.holdersCombination",
        deletable: false,
        match: /^\/watchlist\/.+\/furtherInformation\/holdersCombination([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
      },
      {
        path:"furtherInformation/type",
        title: "bottom-panel.furtherInformation.type",
        deletable: false,
        match: /^\/watchlist\/.+\/furtherInformation\/type([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
      },
    ],
    match: /^\/watchlist\/.+\/furtherInformation\/[^\/]+([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
    current: "furtherInformation/depth",
    deletable: false,
  },
  {
    title: "bottom-panel.archive.index",
    match: /^\/watchlist\/.+\/archive\/[^\/]+([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
    component: "bottom-panel-archive",
    children: [
      {
        path: "archive/tradesHistory?offset=0&length=20",
        title: "bottom-panel.archive.tradesHistory",
        component:"bottom-panel-archive-tradeHistoryTransactions",
        deletable: false,
        match: /^\/watchlist\/.+\/archive\/tradesHistory([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
      },
      {
        path: "archive/holdersCompition",
        title: "bottom-panel.archive.holdersCompition",
        deletable: false,
        match: /^\/watchlist\/.+\/archive\/holdersCompition([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
      },
      {
        path: "archive/type?offset=0&length=20",
        title: "bottom-panel.archive.type",
        deletable: false,
        match: /^\/watchlist\/.+\/archive\/type([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
      },
    ],
    deletable: false,
    current: "archive/tradesHistory?offset=0&length=20",
  },
  {
    title: "bottom-panel.statisticsKeys.index",
    match: /^\/watchlist\/.+\/statisticsKeys\/[^\/]+([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
    children: [
      {
         path: "statisticsKeys/fiveDay",
        title: "bottom-panel.statisticsKeys.fiveDay",
        
        deletable: false,
        match: /^\/watchlist\/.+\/statisticsKeys\/fiveDay([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
        
      },
      {
         path: "statisticsKeys/threeDay",
        title: "bottom-panel.statisticsKeys.threeDay",
        deletable: false,
        match: /^\/watchlist\/.+\/statisticsKeys\/threeDay([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
        
      },
    ],
    deletable: false,
    current: "statisticsKeys/fiveDay",
  },
  {
    title: "bottom-panel.more.index",
    match: /^\/watchlist\/.+\/more\/[^\/]+([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
    children: [
      {
        path: "more/presentation",
        title: "bottom-panel.more.presentation",
        deletable: false,
        match: /^ \/watchlist\/([^/]+?)\/more\/presentation\?[^/]\w\/?$/g ,
        
      },
      {
        path: "more/directorate",
        title: "bottom-panel.more.directorate",
        deletable: false,
        match: /^\/watchlist\/.+\/more\/directorate([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
      },
    ],
    current: "more/presentation",
    deletable: false,
    component: "lazy-pages-login"
  },
];

export default panels;
