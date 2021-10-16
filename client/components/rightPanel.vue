<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    :clipped="clipped"
    :right="rtl"
    width="260"
    :expand-on-hover="mini"
    absolute
    fixed
    app
  >
    <v-list dense>
      <v-list-item-group v-model="selected">
        <div v-for="(item, i) in items" :key="i" class="ma-0 pa-0">
          <v-list-group v-if="item.children" class="ma-0 px-0">
            <v-tooltip slot="activator" left>
              <template #activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" class="pe-2">
                  {{ item.icon }}
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="$t(item.title)" />
                </v-list-item-content>
              </template>
              <span>{{ $t(item.title) }}</span>
            </v-tooltip>
            <v-list-item-group>
              <v-list-item
                v-for="subItem in item.children.value"
                :key="subItem.title"
                :to="subItem.to"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="$t(subItem.title)" />
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list-group>
          <v-list-item v-else :to="item.to" :value="i" router exact dense>
            <v-tooltip left>
              <template #activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" class="pe-2">
                  {{ item.icon }}
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="$t(item.title)" />
                </v-list-item-content>
              </template>
              <span>{{ $t(item.title) }}</span>
            </v-tooltip>
          </v-list-item>
        </div>
        <v-divider />
        <v-list-item to="/deposit">
          <v-tooltip left>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" class="pe-2" color="success">
                adaico-card-receive
              </v-icon>
              <v-list-item-content>
                <v-list-item-title v-if="selectedItem || !selectedItem.click">
                  {{ $t("menu.deposit") }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <span>{{ $t("menu.deposit") }}</span>
          </v-tooltip>
        </v-list-item>
        <v-list-item to="/refund">
          <v-tooltip left>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" class="pe-2" color="error">
                adaico-card-send
              </v-icon>
              <v-list-item-content>
                <v-list-item-title v-if="selectedItem || !selectedItem.click">
                  {{ $t("menu.refund") }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <span>{{ $t("menu.refund") }}</span>
          </v-tooltip>
        </v-list-item>
      </v-list-item-group>
    </v-list>
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
    const selected: Ref = ref(null);
    const rtl = computed(() => store.getters["rtl"]);
    const watchList = computed(() => {
      const lists = store.getters["user/watchList"];
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
