<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    :clipped="clipped"
    :right="rtl"
    width="260"
    expand-on-hover
    fixed
    app
  >
    <v-list dense>
      <v-list-item-group v-model="selected">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          @click="() => item.click && item.click()"
          :value="i"
          router
          exact
          dense
        >
          <v-tooltip left>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" class="pe-2">
                {{ item.icon }}
              </v-icon>
              <v-list-item-content>
                <v-list-item-title
                  v-if="!selectedItem || !selectedItem.children"
                  v-text="$t(item.title)"
                />
              </v-list-item-content>
            </template>
            <span>{{ $t(item.title) }}</span>
          </v-tooltip>
        </v-list-item>
        <v-divider />
        <v-list-item to="/deposit">
          <v-tooltip left>
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" class="pe-2" color="success">
                mdi-cash-plus
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
                mdi-cash-refund
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
} from "@nuxtjs/composition-api";

export default defineComponent({
  name: "right-panel",
  emits: ["openWatchList"],
  props: {
    drawer: Boolean,
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
        icon: "mdi-eye",
        title: "menu.watchList",
        children: watchList,
      },
      {
        icon: "mdi-chart-pie",
        title: "menu.portfolio",
        to: "/portfolio",
      },
      {
        icon: "mdi-calculator",
        title: "menu.accounting",
        to: "/accounting",
      },
      {
        icon: "mdi-cash",
        title: "menu.trades",
        to: "/trades",
      },
      {
        icon: "mdi-presentation",
        title: "menu.alerts",
        to: "/alerts",
      },
      {
        icon: "mdi-book-sync-outline",
        title: "menu.drafts",
        to: "/drafts",
      },
      {
        icon: "mdi-currency-usd",
        title: "menu.conditionalTrades",
        to: "/conditional-trades",
      },
      {
        icon: "mdi-filter-plus-outline",
        title: "menu.filter",
        to: "/filters",
      },
      {
        icon: "mdi-chart-line",
        title: "menu.technical",
        to: "/technical",
      },
      {
        icon: "mdi-file-document-multiple-outline",
        title: "menu.profit",
        to: "/profit",
      },
      {
        icon: "mdi-map-outline",
        title: "menu.marketMap",
        to: "/market-map",
      },
      {
        icon: "mdi-cog",
        title: "menu.settings",
        to: "/settings",
      },
      {
        icon: "mdi-chart-bar",
        title: "menu.reports",
        to: "/inspire",
      },
    ];
    const expand = ref(true);
    return {
      rtl,
      selected,
      selectedItem,
      items,
    };
  },
});
</script>
