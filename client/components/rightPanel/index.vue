<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    :clipped="clipped"
    :right="rtl"
    class="r-panel ps-0"
    width="152"
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
            <v-btn width="32" height="32" depressed>
              <v-icon size="16" :color="item.color" v-bind="attrs" v-on="on">
                {{ item.icon }}
              </v-icon>
            </v-btn>
          </template>
          <span>{{ item.text ? item.text : $t(item.title) }}</span>
        </v-tooltip>
      </v-tab>
      <v-divider />
      <v-tab v-for="item in staticItems" :key="item.title" :to="item.to">
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn width="32" height="32" depressed>
              <v-icon size="16" :color="item.color" v-bind="attrs" v-on="on">
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
                  <div
                    v-for="sub in child.children
                      ? child.children.value
                        ? child.children.value
                        : child.children
                      : []"
                    :key="sub.title"
                    class="sub-item ps-4"
                  >
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
                          icon
                          x-small
                        >
                          <v-icon
                            :color="isMarked(sub) ? 'secondary' : 'default'"
                            size="16"
                          >
                            mdi-star
                          </v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </div>
                </v-list-group>
                <v-list-item
                  v-else
                  class="item mx-1"
                  :to="child.to ? child.to : '#'"
                >
                  <v-list-item-title>
                    {{ child.text ? child.text : $t(child.title) }}
                  </v-list-item-title>
                </v-list-item>
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
    const isMarked = computed(() => (data: any) => {
      return bookmarks.value.findIndex((val) => val.to == data.to) > -1;
    });
    const watchList = computed(() => {
      const lists = userManager.watchList;
      const res = [];
      for (let k in lists.value) {
        res.push(
          new MenuItem({
            title: k,
            text: k,
            to: "/watchList/" + k,
            bookmarkPosition: BookmarkPosition.ToolBar,
          })
        );
      }
      return res;
    });
    const items: Array<MenuItem> = [
      new MenuItem({
        icon: "isax-eye",
        title: "menu.watchList",
        children: [
          new MenuItem({
            icon: "mdi-basket",
            title: "menu.wealth",
            to: "/watchlist/wealth",
          }),
          new MenuItem({
            icon: "mdi-basket",
            title: "menu.basket",
            children: watchList,
          }),
          new MenuItem({
            icon: "mdi-basket",
            title: "menu.industries",
            to: "/watchlist/industries",
          }),
          new MenuItem({
            icon: "mdi-basket",
            title: "menu.boards",
            to: "/watchlist/boards",
          }),
          new MenuItem({
            icon: "mdi-basket",
            title: "menu.instrumentTypes",
            to: "/watchlist/instrumentTypes",
          }),
        ],
      }),
      new MenuItem({
        icon: "isax-graph",
        title: "menu.portfolio",
        children: [
          new MenuItem({
            icon: "isax-graph",
            title: "menu.brokerage",
            to: "/portfolio/brokerage",
          }),
          new MenuItem({
            icon: "isax-graph",
            title: "menu.realtime",
            to: "/portfolio/realtime",
          }),
        ],
      }),
      new MenuItem({
        icon: "isax-calculator",
        title: "menu.accounting",
        children: [
          new MenuItem({
            icon: "isax-calculator",
            title: "menu.deposit",
            to: "/accounting/deposit",
          }),
          new MenuItem({
            icon: "isax-calculator",
            title: "menu.refund",
            to: "/accounting/refund",
          }),
        ],
      }),
      new MenuItem({
        icon: "isax-money-change",
        title: "menu.trades",
        to: "/trades",
      }),
      new MenuItem({
        icon: "isax-presention-chart",
        title: "menu.alerts",
        to: "/alerts",
      }),
      new MenuItem({
        icon: "isax-convert-card-outline",
        title: "menu.drafts",
        to: "/drafts",
      }),
      new MenuItem({
        icon: "isax-money-recive",
        title: "menu.conditionalTrades",
        to: "/conditional-trades",
      }),
      new MenuItem({
        icon: "isax-filter-edit",
        title: "menu.filter",
        to: "/filters",
      }),
      new MenuItem({
        icon: "isax-status-up",
        title: "menu.technical",
        to: "/technical",
      }),
      new MenuItem({
        icon: "isax-note-2",
        title: "menu.profit",
        to: "/profit",
      }),
      new MenuItem({
        icon: "isax-map-outline",
        title: "menu.marketMap",
        to: "/market-map",
      }),
      new MenuItem({
        icon: "isax-setting-2",
        title: "menu.settings",
        to: "/settings",
      }),
    ];

    const staticItems: Array<Bookmark> = [];

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
            const tmp = [...bookmarks.value, CreateBookmark(data)];
            userManager.update_settings({
              path: "/sourtcuts",
              value: tmp,
            });
          }
          break;
      }
    }
    function unmark(data: Bookmark) {
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
      staticItems,
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
            .v-btn
              color: $c-primary
              background-color: rgba($c-primary,0.1)
</style>