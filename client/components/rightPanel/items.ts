import { ComputedRef, Ref } from "#app";
import { BookmarkPosition, MenuItem } from "~/types";

export default {
  getMenuItems,
};

export function getMenuItems(
  watchList: ComputedRef<Array<MenuItem>>, secondWatchList: Ref<MenuItem[]>
): Array<MenuItem> {
  return [
    {
      icon: "lotfi-task-square",
      title: "menu.watchList",
      children: [
        {
          icon: "mdi-basket",
          title: "menu.wealth",
          to: "/watchlist/wealth",
          bookmarkPosition: BookmarkPosition.ToolBar,
        },
        {
          icon: "lotfi-task-square",
          title: "menu.basket",
          children: watchList,
        },
        {
          icon: "lotfi-task-square",
          title: "menu.bests",
          children: secondWatchList
        },
        {
          icon: "lotfi-task-square",
          title: "menu.industries",
          to: "/watchlist/industries",
        },
        {
          icon: "lotfi-task-square",
          title: "menu.boards",
          to: "/watchlist/boards",
        },
        {
          icon: "lotfi-task-square",
          title: "menu.instrumentTypes",
          to: "/watchlist/instrumentTypes",
        },
        {
          icon: "lotfi-task-square",
          title: "menu.conditional",
          to: "/watchlist/conditional",
        },
      ],
    },
    {
      icon: "isax-graph",
      title: "menu.portfolio",
      children: [
        {
          icon: "isax-graph",
          title: "menu.brokerage",
          to: "/portfolio/brokerage",
          bookmarkPosition: BookmarkPosition.RightPanel,
        },
        {
          icon: "isax-graph",
          title: "menu.realtime",
          to: "/portfolio/realtime",
          bookmarkPosition: BookmarkPosition.RightPanel,
        },
      ],
    },
    {
      icon: "isax-calculator",
      title: "menu.accounting",
      children: [
        {
          icon: "isax-card-receive",
          title: "menu.deposit",
          to: "/accounting/deposit",
          color: "success",
          bookmarkPosition: BookmarkPosition.RightPanel,
        },
        {
          icon: "lotfi-receipt-edit-3",
          title: "menu.depositReport",
          to: "/accounting/deposit-report",
          bookmarkPosition: BookmarkPosition.RightPanel,
        },
        {
          icon: "isax-card-send",
          title: "menu.refund",
          to: "/accounting/refund",
          color: "error",
          bookmarkPosition: BookmarkPosition.RightPanel,
        },
        {
          icon: "lotfi-receipt-edit",
          title: "menu.refundReport",
          to: "/accounting/refund-report",
          bookmarkPosition: BookmarkPosition.RightPanel,
        },
        {
          icon: "lotfi-empty-wallet-tick",
          title: "menu.credits",
          to: "/accounting/credits",
          bookmarkPosition: BookmarkPosition.RightPanel,
        },
      ],
    },
    {
      icon: "isax-money-change",
      title: "menu.trades",
      children: [
        {
          icon: "lotfi-receipt-edit-2",
          title: "menu.tradesReport",
          to: "tradesReport",
          bookmarkPosition: BookmarkPosition.RightPanel,
        },
        {
          icon: "lotfi-group",
          title: "menu.switchBrokerage",
          to: "switchBrokerage",
          color: "warning",
          bookmarkPosition: BookmarkPosition.RightPanel,
        },
        {
          icon: "lotfi-receipt-edit-1",
          title: "menu.switchBrokerageReport",
          to: "switchBrokerageReport",
          bookmarkPosition: BookmarkPosition.RightPanel,
        },
      ],
    },
    {
      icon: "isax-presention-chart",
      title: "menu.alerts",
      to: "/alerts",
      bookmarkPosition: BookmarkPosition.RightPanel,
    },
    {
      icon: "isax-convert-card-outline",
      title: "menu.drafts",
      to: "/drafts",
      bookmarkPosition: BookmarkPosition.RightPanel,
    },
    {
      icon: "lotfi-wallet-money",
      title: "menu.conditionalTrades",
      to: "/conditional-trades",
      bookmarkPosition: BookmarkPosition.RightPanel,
    },
    {
      icon: "isax-filter-edit",
      title: "menu.filter",
      to: "/filters",
      bookmarkPosition: BookmarkPosition.RightPanel,
    },
    {
      icon: "isax-status-up",
      title: "menu.technical",
      to: "/technical",
      bookmarkPosition: BookmarkPosition.RightPanel,
    },
    {
      icon: "lotfi-note-2",
      title: "menu.profit",
      to: "/profit",
      bookmarkPosition: BookmarkPosition.RightPanel,
    },
    {
      icon: "isax-map-outline",
      title: "menu.marketMap",
      to: "/market-map",
      bookmarkPosition: BookmarkPosition.RightPanel,
    },
    {
      icon: "isax-setting-2",
      title: "menu.settings",
      to: "/settings",
      bookmarkPosition: BookmarkPosition.RightPanel,
    },
  ];
}
