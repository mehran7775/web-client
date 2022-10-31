import { ComputedRef, Ref } from "vue";
import { BookmarkPosition, MenuItem } from "~/types";

export default {
  getMenuItems,
};

export function getMenuItems(): Array<MenuItem> {
  return [
    {
      icon: "isax-graph",
      title: "menu.portfolio",
      match: /^\/watchlist\/.+\/portfolio([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
      children: [
        {
          icon: "isax-graph",
          title: "menu.portfolio",
          to: "portfolio",
          color: "success",
          match: /^\/watchlist\/.+\/portfolio\/[^\/]+([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
        }
      ]
    },
    {
      icon: "isax-calculator",
      title: "menu.accounting",
      match: /^\/watchlist\/.+\/accounting\/[^\/]+([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
      children: [
        {
          icon: "isax-card-receive",
          title: "menu.deposit",
          to: "accounting/deposit",
          color: "success",
          match: /^\/watchlist\/.+\/accounting\/deposit([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
          
        },
        {
          icon: "isax-card-receive",
          title: "menu.receiptRegister",
          to: "accounting/receiptRegister",
          color: "success",
          match: /^\/watchlist\/.+\/accounting\/receiptRegister([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
        },
        {
          icon: "isax-card-send",
          title: "menu.refund",
          to: "accounting/refund",
          color: "error",
          match: /^\/watchlist\/.+\/accounting\/refund([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
        },
        {
          icon: "lotfi-empty-wallet-tick",
          title: "menu.credits",
          to: "accounting/credits",
          match: /^\/watchlist\/.+\/accounting\/credits([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
        },
      ],
    },
    {
      icon: "isax-money-change",
      title: "menu.trades",
      match: /^\/watchlist\/.+\/trades\/[^\/]+([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
      children: [
        {
          icon: "lotfi-receipt-edit-2",
          title: "menu.tradesReport",
          to: "trades/report",
          match: /^\/watchlist\/.+\/trades\/report([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
        },
        {
          icon: "lotfi-group",
          title: "menu.switchBrokerage",
          to: "trades/switchBrokerage",
          color: "warning",
          match: /^\/watchlist\/.+\/trades\/switchBrokerage([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
        },
        {
          icon: "lotfi-receipt-edit-1",
          title: "menu.switchBrokerageReport",
          to: "trades/switchBrokerageReport",
          match: /^\/watchlist\/.+\/trades\/switchBrokerageReport([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
        },
      ],
    },
    {
      icon: "isax-presention-chart",
      title: "menu.alerts",
      to: "alerts",
      bookmarkPosition: BookmarkPosition.RightPanel,
      match: /^\/watchlist\/.+\/alerts\/[^\/]+([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
    },
    {
      icon: "isax-convert-card-outline",
      title: "menu.drafts",
      to: "drafts",
      bookmarkPosition: BookmarkPosition.RightPanel,
      match: /^\/watchlist\/.+\/drafts\/[^\/]+([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
    },
    {
      icon: "lotfi-wallet-money",
      title: "menu.conditionalTrade",
      to: "conditional-trade",
      bookmarkPosition: BookmarkPosition.RightPanel,
      match: /^\/watchlist\/.+\/conditional-trade\/[^\/]+([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
    },
    {
      icon: "isax-filter-edit",
      title: "menu.filter",
      to: "filters",
      bookmarkPosition: BookmarkPosition.RightPanel,
       match: /^\/watchlist\/.+\/filters\/[^\/]+([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
    },
    {
      icon: "isax-status-up",
      title: "menu.technical",
      to: "technical",
      bookmarkPosition: BookmarkPosition.RightPanel,
       match: /^\/watchlist\/.+\/technical\/[^\/]+([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
    },
    {
      icon: "lotfi-note-2",
      title: "menu.profit",
      to: "profit",
      bookmarkPosition: BookmarkPosition.RightPanel,
       match: /^\/watchlist\/.+\/profit\/[^\/]+([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
    },
    {
      icon: "isax-map-outline",
      title: "menu.marketMap",
      to: "market-map",
      bookmarkPosition: BookmarkPosition.RightPanel,
      match: /^\/watchlist\/.+\/market-map\/[^\/]+([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
    },
    {
      icon: "isax-setting-2",
      title: "menu.settings",
      to: "settings",
      bookmarkPosition: BookmarkPosition.RightPanel,
      match: /^\/watchlist\/.+\/settings\/[^\/]+([?](.+[=].+[&]?)+)?([\/]{1})?$/g ,
    },
  ];
}
