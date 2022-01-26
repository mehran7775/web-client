<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    :clipped="clipped"
    :right="rtl"
    class="panel ps-0"
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
            <v-icon :color="item.color" v-bind="attrs" v-on="on">
              {{ item.icon }}
            </v-icon>
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
                <v-list-group v-if="child.children" append-icon.size="12">
                  <template #appendIcon>
                    <v-icon x-small> isax-arrow-down </v-icon>
                  </template>
                  <v-list-item-title slot="activator">
                    {{ child.text ? child.text : $t(child.title) }}
                  </v-list-item-title>
                  <v-list-item
                    v-for="sub in child.children
                      ? child.children.value
                        ? child.children.value
                        : child.children
                      : []"
                    :key="sub.title"
                    :to="sub.to ? sub.to : '#'"
                  >
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
                </v-list-group>
                <v-list-item v-else :to="child.to ? child.to : '#'">
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
import { Bookmark } from "~/types";
import { useAsrTrader } from "~/composables";

export default defineComponent({
  name: "right-panel",
  props: {
    value: Boolean,
    mini: Boolean,
    clipped: Boolean,
  },
  setup(props, context) {
    const store = useStore();
    const appManager = useAsrTrader(store);
    const router = useRouter();
    const sh = useShortcut();
    const selected = appManager.menu;
    const rtl = appManager.rtl;
    const bookmarks = computed(
      () => store.getters["sso/user/getBookmarks"] as Array<Bookmark>
    );
    const isMarked = computed(() => (data: any) => {
      return bookmarks.value.findIndex((val) => val.to == data.to) > -1;
    });
    const watchList = computed(() => {
      const lists = store.getters["sso/user/watchList"];
      const res = [];
      for (let k in lists) {
        res.push({
          title: k,
          text: k,
          to: "/watchList/" + k,
        });
      }
      return res;
    });
    const items = [
      {
        icon: "isax-eye",
        title: "menu.watchList",
        children: [
          {
            icon: "mdi-basket",
            title: "menu.wealth",
            to: "/watchlist/wealth",
          },
          {
            icon: "mdi-basket",
            title: "menu.basket",
            children: watchList,
          },
          {
            icon: "mdi-basket",
            title: "menu.industries",
            to: "/watchlist/industries",
          },
          {
            icon: "mdi-basket",
            title: "menu.boards",
            to: "/watchlist/boards",
          },
          {
            icon: "mdi-basket",
            title: "menu.instrumentTypes",
            to: "/watchlist/instrumentTypes",
          },
        ],
      },
      {
        icon: "isax-graph",
        title: "menu.portfolio",
        to: "/portfolio",
      },
      {
        icon: "isax-calculator",
        title: "menu.accounting",
        to: "/accounting",
      },
      {
        icon: "isax-money-change",
        title: "menu.trades",
        to: "/trades",
      },
      {
        icon: "isax-presention-chart",
        title: "menu.alerts",
        to: "/alerts",
      },
      {
        icon: "isax-convert-card-outline",
        title: "menu.drafts",
        to: "/drafts",
      },
      {
        icon: "isax-money-recive",
        title: "menu.conditionalTrades",
        to: "/conditional-trades",
      },
      {
        icon: "isax-filter-edit",
        title: "menu.filter",
        to: "/filters",
      },
      {
        icon: "isax-status-up",
        title: "menu.technical",
        to: "/technical",
      },
      {
        icon: "isax-note-2",
        title: "menu.profit",
        to: "/profit",
      },
      {
        icon: "isax-map",
        title: "menu.marketMap",
        to: "/market-map",
      },
      {
        icon: "isax-setting-2",
        title: "menu.settings",
        to: "/settings",
      },
      {
        icon: "isax-chart-2",
        title: "menu.reports",
        to: "/inspire",
      },
    ];

    const staticItems = [
      {
        color: "success",
        icon: "isax-card-receive",
        title: "menu.deposit",
        to: "/deposit",
      },
      {
        color: "error",
        icon: "isax-card-send",
        title: "menu.refund",
        to: "/refund",
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

    function mark(data: Bookmark) {
      const tmp = [
        ...bookmarks.value,
        Object.assign({ icon: "mdi-star" }, data),
      ];
      store.dispatch("sso/user/update_settings", {
        path: "/bookmarks",
        value: tmp,
      });
    }
    function unmark(data: Bookmark) {
      let tmp = [...bookmarks.value];
      tmp.splice(
        tmp.findIndex((item) => item.to == data.to),
        1
      );
      store.dispatch("sso/user/update_settings", {
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
              router.push(watchList.value[i - 1].to);
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

<style lang="sass">
.panel
  overflow: hidden
  padding-top: 4px
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