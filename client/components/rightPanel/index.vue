<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    :clipped="clipped"
    :right="rtl"
    class="panel ps-0"
    width="220"
    fixed
    app
  >
    <v-tabs
      class="ma-0 pa-0"
      v-model="selected"
      optional
      vertical
      hide-slider
      centered
    >
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
          <template v-slot:activator="{ on, attrs }">
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
    </v-tabs>

    <v-tabs-items v-model="selected">
      <v-tab-item v-for="item in items" :key="item.title">
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
                  {{ sub.text ? sub.text : $t(sub.title) }}
                </v-list-item-title>
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
  watch,
  ComputedRef,
} from "@nuxtjs/composition-api";

export default defineComponent({
  name: "right-panel",
  emits: ["openWatchList"],
  props: {
    value: Boolean,
    mini: Boolean,
    clipped: Boolean,
  },
  setup(props, context) {
    const store = useStore();
    const selected: ComputedRef<number | null> = computed({
      get() {
        return store.getters["menu"];
      },
      set(value) {
        store.commit("setMenu", value);
      },
    });
    const rtl = computed(() => store.getters["rtl"]);
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

    watch(selected, (n, o) => {
      if (typeof n != typeof undefined) context.emit("update:mini", false);
    });

    return {
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
  ::-webkit-scrollbar
    display: none
  .v-tabs-items
    background-color: #EEEEEE !important
    height: 100%
    width: calc(100% - 56px)
    display: inline-block
    margin-right: -5px
  .v-tabs
    display: inline-block
    width: 56px
    vertical-align: top
    &--vertical
      > .v-tabs-bar
        .v-tab
          justify-content: start !important
          height: 32px !important
          &--active
            box-shadow: 5px 0px 5px 0px grey
</style>