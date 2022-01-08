<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    :clipped="clipped"
    :right="rtl"
    class="panel ps-0"
    width="240"
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
            <v-icon :color="item.color" v-bind="attrs" v-on="on">
              {{ item.icon }}
            </v-icon>
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
      <v-tab
        v-for="item in bookmarks"
        :key="item.title"
        :to="item.to + '#'"
        @click="
          () => {
            $emit('update:mini', true);
          }
        "
      >
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-if="item.icon"
              :color="item.color"
              v-bind="attrs"
              v-on="on"
            >
              {{ item.icon ? item.icon : "mdi-star" }}
            </v-icon>
            <v-btn v-bind="attrs" v-on="on" depressed x-small>
              {{ item.title }}
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
              <v-list-group
                v-for="child in item.children
                  ? item.children.filter((v) => v.children)
                  : []"
                :key="child.title"
              >
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
                          if (bookmarks.indexOf(sub) > -1) unmark(sub);
                          else bookmark(sub);
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
              <v-divider />
              <v-list-item
                v-for="child in item.children
                  ? item.children.filter((v) => !v.children)
                  : []"
                :key="child.title"
                :to="child.to ? child.to : '#'"
              >
                <v-list-item-title>
                  {{ child.text ? child.text : $t(child.title) }}
                </v-list-item-title>
              </v-list-item>
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
  useContext,
  useRouter,
  watch,
  ComputedRef,
} from "@nuxtjs/composition-api";
import { useShortcut } from "@/utils/shortcutManager";

export default defineComponent({
  name: "right-panel",
  props: {
    value: Boolean,
    mini: Boolean,
    clipped: Boolean,
  },
  setup(props, context) {
    const store = useStore();
    const router = useRouter();
    const ctx = useContext();
    const sh = useShortcut();
    const selected: ComputedRef<number> = computed({
      get() {
        return store.getters["menu"] ?? 0;
      },
      set(value) {
        store.commit("setMenu", value);
      },
    });
    const rtl = computed(() => store.getters["rtl"]);
    const bookmarks: ComputedRef<Array<any>> = computed(
      () => store.getters["sso/user/getBookmarks"]
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
        icon: "adaico-eye",
        title: "menu.watchList",
        children: [
          {
            icon: "mdi-basket",
            title: "menu.basket",
            children: watchList,
          },
          {
            icon: "mdi-basket",
            title: "menu.industries",
          },
          {
            icon: "mdi-basket",
            title: "menu.boards",
          },
          {
            icon: "mdi-basket",
            title: "menu.instrumentTypes",
          },
        ],
      },
      {
        icon: "adaico-graph",
        title: "menu.portfolio",
        to: "/portfolio",
      },
      {
        icon: "adaico-calculator",
        title: "menu.accounting",
        to: "/accounting",
      },
      {
        icon: "adaico-money-change",
        title: "menu.trades",
        to: "/trades",
      },
      {
        icon: "adaico-presention-chart",
        title: "menu.alerts",
        to: "/alerts",
      },
      {
        icon: "mdi-book-sync-outline",
        title: "menu.drafts",
        to: "/drafts",
      },
      {
        icon: "adaico-money-recive",
        title: "menu.conditionalTrades",
        to: "/conditional-trades",
      },
      {
        icon: "adaico-filter-edit",
        title: "menu.filter",
        to: "/filters",
      },
      {
        icon: "adaico-status-up",
        title: "menu.technical",
        to: "/technical",
      },
      {
        icon: "adaico-note-2",
        title: "menu.profit",
        to: "/profit",
      },
      {
        icon: "adaico-map",
        title: "menu.marketMap",
        to: "/market-map",
      },
      {
        icon: "adaico-setting-2",
        title: "menu.settings",
        to: "/settings",
      },
      {
        icon: "adaico-chart-2",
        title: "menu.reports",
        to: "/inspire",
      },
    ];
    const staticItems = [
      {
        color: "success",
        icon: "adaico-card-receive",
        title: "menu.deposit",
        to: "/deposit",
      },
      {
        color: "error",
        icon: "adaico-card-send",
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

    function bookmark(data: object) {
      store.commit("sso/user/addBookmark", data);
    }
    function unmark(data: object) {
      store.commit("sso/user/removeBookmark", data);
    }

    if (process.client) {
      watch(selected, (n, o) => {
        if (typeof n != null) {
          context.emit("update:mini", false);
        }
      });
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
      bookmark,
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
    width: 56px !important
  .v-navigation-drawer__content
    display: flex
    flex-direction: row
  ::-webkit-scrollbar
    display: none
  .v-tabs-items
    background-color: #EEEEEE !important
    height: 100%
    width: calc(100% - 56px)
    display: block
  .v-tabs
    width: 56px
    vertical-align: top
    &--vertical
      > .v-tabs-bar
        .v-tabs-bar__content
          display: block
        .v-tab
          padding: 0
          padding-top: 3px
          display: block
          vertical-align: middle
          justify-content: center !important
          min-width: 48px
          height: 32px !important
          &--active
            box-shadow: 5px 0px 5px 0px grey
</style>