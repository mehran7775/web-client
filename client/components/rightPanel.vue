<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    :clipped="clipped"
    :right="rtl"
    class="panel ps-0"
    width="260"
    fixed
    app
  >
    <v-tabs v-model="selected" :show-arrows="true" vertical hide-slider>
      <v-tab v-for="item in items" :key="item.title">
        <v-icon right>
          {{ item.icon }}
        </v-icon>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="selected">
      <v-tab-item v-for="item in items" :key="item.title">
        <h4 class="text-center">
          {{ $t(item.title) }}
        </h4>
        <v-list rounded dense>
          <v-list-item-group>
            <v-list-item
              v-for="child in item.children ? item.children.value : []"
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
  useContext,
  watch,
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
    const ctx = useContext();
    const store = useStore();
    const selected: Ref = ref(null);
    const rtl = computed(() => store.getters["rtl"]);
    const watchList = computed(() => {
      const lists = store.getters["sso/user/watchList"];
      const res = [];
      for (let k in lists) {
        res.push({
          title: k,
          to: "/watchList/" + k,
        });
      }
      return res;
    });
    const selectedItem = computed(() => {
      const ind = parseInt(selected.value);
      return !isNaN(ind) ? items[selected.value] : false;
    });
    const items = [
      {
        icon: "adaico-eye",
        title: "menu.watchList",
        children: watchList,
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
    const expand = ref(true);
    const drawer = computed({
      get() {
        return props.value;
      },
      set(value: boolean) {
        context.emit("input", value);
      },
    });

    watch(selected, (n, o) => {
      context.emit("update:mini", false);
    });

    return {
      rtl,
      drawer,
      expand,
      selected,
      selectedItem,
      items,
    };
  },
});
</script>

<style lang="sass">
.panel
  padding-top: 1pt
  .v-tabs-items
    height: calc(100% - 64px)
    width: calc(100% - 61px)
    display: inline-block
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

<style scoped>
@media only screen and (min-height: 641px) {
  .scroll {
    display: none;
  }
}
@media only screen and (max-height: 640px) {
  .scroll {
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    height: 15px;
    width: 100%;
    color: white;
    position: fixed;
  }
  .scroll.up {
    top: 0;
  }
  .scroll.down {
    bottom: 0;
    margin-top: -20px;
  }
}
/* width */
.panel ::-webkit-scrollbar {
  display: none;
}
.panel {
  overflow: hidden;
}
</style>