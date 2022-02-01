<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    :clipped="clipped"
    :right="rtl"
    class="r-panel ps-0"
    width="152"
    mobile-breakpoint="960"
    fixed
    app
  >
    <v-tabs class="ma-0 pa-0" v-model="selected" vertical hide-slider>
      <v-tab
        v-for="item in items"
        :key="item.title"
        @click="
          () => {
            $emit('update:mini', !mini);
          }
        "
      >
        <v-tooltip left>
          <template #activator="{ on, attrs }">
            <v-btn width="32" height="32" color="transparent" depressed>
              <v-icon size="18" :color="item.color" v-bind="attrs" v-on="on">
                {{ item.icon }}
              </v-icon>
            </v-btn>
          </template>
          <span>{{ item.text ? item.text : $t(item.title) }}</span>
        </v-tooltip>
      </v-tab>
      <v-divider />
      <v-tab v-for="item in shourtcuts" :key="item.title" :to="item.to">
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn width="32" height="32" depressed>
              <v-icon size="18" :color="item.color" v-bind="attrs" v-on="on">
                {{ item.icon }}
              </v-icon>
            </v-btn>
          </template>
          <span>{{ item.text ? item.text : $t(item.title) }}</span>
        </v-tooltip>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="selected">
      <v-tab-item v-for="item in items" :key="item.title">
        <div>
          <h4 class="text-center">
            {{ $t(item.title) }}
          </h4>
          <v-list dense>
            <v-list-item-group>
              <div
                v-for="child in item.children ? item.children : []"
                :key="child.title"
              >
                <v-list-group
                  class="item mx-1 group"
                  v-if="child.children"
                  append-icon.size="12"
                >
                  <template #appendIcon>
                    <v-icon x-small> isax-arrow-down </v-icon>
                  </template>
                  <v-list-item-title slot="activator">
                    {{ child.text ? child.text : $t(child.title) }}
                  </v-list-item-title>
                  <v-tooltip
                    v-for="sub in child.children
                      ? child.children.value
                        ? child.children.value
                        : child.children
                      : []"
                    :key="sub.title"
                    left
                  >
                    <template #activator="{ on, attrs }">
                      <div v-on="on" v-bind="attrs" class="sub-item ps-4">
                        <div class="path ms-n2"></div>
                        <v-list-item :to="sub.to ? sub.to : '#'">
                          <v-list-item-title>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {{ sub.text ? sub.text : $t(sub.title) }}
                          </v-list-item-title>
                          <v-list-item-action class="my-0">
                            <v-btn
                              @click.prevent="
                                (ev) => {
                                  if (isMarked(sub)) unmark(sub);
                                  else mark(sub);
                                }
                              "
                              v-if="sub.bookmarkPosition"
                              icon
                              small
                            >
                              <v-icon
                                :color="isMarked(sub) ? 'secondary' : 'default'"
                                x-small
                              >
                                mdi-star
                              </v-icon>
                            </v-btn>
                          </v-list-item-action>
                        </v-list-item>
                      </div>
                    </template>
                    {{ sub.text ? sub.text : $t(sub.title) }}
                  </v-tooltip>
                </v-list-group>
                <v-tooltip v-else left>
                  <template #activator="{ on, attrs }">
                    <v-list-item
                      v-on="on"
                      v-bind="attrs"
                      class="item mx-1"
                      :to="child.to ? child.to : '#'"
                    >
                      <v-list-item-title>
                        {{ child.text ? child.text : $t(child.title) }}
                      </v-list-item-title>
                      <v-list-item-action
                        v-if="child.to && child.to != ''"
                        class="my-0"
                      >
                        <v-btn
                          @click.prevent="
                            (ev) => {
                              if (isMarked(child)) unmark(child);
                              else mark(child);
                            }
                          "
                          v-if="child.bookmarkPosition"
                          icon
                          small
                        >
                          <v-icon
                            :color="isMarked(child) ? 'secondary' : 'default'"
                            x-small
                          >
                            mdi-star
                          </v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </template>
                  {{ child.text ? child.text : $t(child.title) }}
                </v-tooltip>
              </div>
            </v-list-item-group>
          </v-list>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  computed,
  useStore,
  useRouter,
  watch,
  reactive,
} from "@nuxtjs/composition-api";
import { useShortcut } from "@/utils/shortcutManager";
import { Bookmark, BookmarkPosition, CreateBookmark, MenuItem } from "~/types";
import { useAsrTrader, useUser } from "~/composables";

export default defineComponent({
  name: "right-panel",
  props: {
    value: Boolean,
    mini: Boolean,
    clipped: Boolean,
  },
  setup(props, context) {
    const store = useStore();
    const userManager = useUser(store);
    const appManager = useAsrTrader(store);
    const router = useRouter();
    const sh = useShortcut();
    const selected = appManager.menu;
    const rtl = appManager.rtl;
    const bookmarks = userManager.getBookmarks;
    const shourtcuts = userManager.getShourtcuts;
    const isMarked = computed(() => (data: MenuItem) => {
      switch (data.bookmarkPosition) {
        case BookmarkPosition.ToolBar:
          return bookmarks.value.findIndex((val) => val.to == data.to) > -1;
        case BookmarkPosition.RightPanel:
          return shourtcuts.value.findIndex((val) => val.to == data.to) > -1;
      }
    });
    const watchList = computed(() => {
      const lists = userManager.watchList;
      const res = [];
      for (let k in lists.value) {
        res.push({
          icon: "isax-eye",
          title: k,
          text: k,
          to: "/watchList/" + k,
          bookmarkPosition: BookmarkPosition.ToolBar,
        });
      }
      return res;
    });
    const items: Array<MenuItem> = [
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
            icon: "isax-card-send",
            title: "menu.refund",
            to: "/accounting/refund",
            color: "error",
            bookmarkPosition: BookmarkPosition.RightPanel,
          },
          {
            icon: "lotfi-receipt-edit",
            title: "menu.refundReport",
            to: "/accounting/refundReport",
            bookmarkPosition: BookmarkPosition.RightPanel,
          },
          {
            icon: "lotfi-receipt-edit-3",
            title: "menu.depositReport",
            to: "/accounting/depositReport",
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

    const expand: Ref<boolean> = ref(true);
    const drawer = computed({
      get() {
        return props.value;
      },
      set(value: boolean) {
        context.emit("input", value);
      },
    });

    function mark(data: MenuItem) {
      switch (data.bookmarkPosition) {
        case BookmarkPosition.ToolBar:
          {
            const tmp = [...bookmarks.value, CreateBookmark(data)];
            userManager.update_settings({
              path: "/bookmarks",
              value: tmp,
            });
          }
          break;
        case BookmarkPosition.RightPanel:
          {
            const tmp = [...shourtcuts.value, CreateBookmark(data)];
            userManager.update_settings({
              path: "/shourtcuts",
              value: tmp,
            });
          }
          break;
      }
    }
    function unmark(data: MenuItem) {
      switch (data.bookmarkPosition) {
        case BookmarkPosition.ToolBar:
          {
            let tmp = [...bookmarks.value];
            tmp.splice(
              tmp.findIndex((item) => item.to == data.to),
              1
            );
            userManager.update_settings({
              path: "/bookmarks",
              value: tmp,
            });
          }
          break;
        case BookmarkPosition.RightPanel:
          {
            let tmp = [...shourtcuts.value];
            tmp.splice(
              tmp.findIndex((item) => item.to == data.to),
              1
            );
            userManager.update_settings({
              path: "/shourtcuts",
              value: tmp,
            });
          }
          break;
      }
    }
    watch(selected, (n, o) => {
      if (typeof n != null) {
        context.emit("update:mini", false);
      }
    });
    if (process.client) {
      for (let i = 1; i < 10; i++) {
        sh.addShortcut({
          key: "alt+Digit" + i.toString(),
          action: () => {
            if (i <= watchList.value.length) {
              router.push(watchList.value[i - 1].to ?? "#");
            }
          },
        });
      }
    }
    return {
      mark,
      unmark,
      isMarked,
      bookmarks,
      rtl,
      drawer,
      expand,
      selected,
      items,
      shourtcuts,
    };
  },
});
</script>

<style lang="sass" scoped>
.sub-item:first-child
  .path
    height: 28px
    top: -12px
.sub-item
  position: relative
  .path
    content: ''
    top: -20px
    height: 37px
    width: 12px
    border-right: 1px solid rgba(0, 0, 0, 0.05)
    border-bottom: 1px solid rgba(0, 0, 0, 0.05)
    border-radius: 0 0 $border-radius-root 0
    position: absolute
</style>

<style lang="sass">
.r-panel
  overflow: hidden
  &.v-navigation-drawer--mini-variant
    width: 42px !important
  .v-navigation-drawer__content
    display: flex
    flex-direction: row
  ::-webkit-scrollbar
    display: none
  .v-tabs-items
    height: 100%
    width: calc(100% - 42px)
    display: block
    .v-list-item
      border-radius: $border-radius-root
    .v-item--active
      color: $c-primary
      &::before
        border-radius: $border-radius-root
    // .v-list-group
    //   &__header
    //     &[aria-expanded="true"]
    //       background-color: rgba($c-primary,0.1)
  .v-tabs
    width: 42px
    vertical-align: top
    &--vertical
      > .v-tabs-bar
        .v-tabs-bar__content
          display: block
        .v-tab
          padding: 0
          display: block
          vertical-align: middle
          justify-content: center !important
          min-width: 42px
          height: 32px !important
          &--active
            &::before
              background-color: rgba(0,0,0,0) !important
            .v-btn
              color: $c-primary
              background-color: rgba($c-primary,0.1) !important
</style>