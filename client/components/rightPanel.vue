<template>
  <v-container class="ma-0 px-0" fluid>
    <v-row dense>
      <v-col>
        <v-list v-model="selected" dense>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            :to="item.to"
            router
            exact
            dense
          >
            <v-tooltip left>
              <template #activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" class="pe-2">{{
                  item.icon
                }}</v-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="$t(item.title)" />
                </v-list-item-content>
              </template>
              <span>{{ $t(item.title) }}</span>
            </v-tooltip>
          </v-list-item>
          <v-divider />
          <v-list-item>
            <v-tooltip left>
              <template #activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" class="pe-2">
                  mdi-cash-plus
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title> in </v-list-item-title>
                </v-list-item-content>
              </template>
              <span>{{ $t("in") }}</span>
            </v-tooltip>
          </v-list-item>
          <v-list-item>
            <v-tooltip left>
              <template #activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" class="pe-2">
                  mdi-cash-refund
                </v-icon>
                <v-list-item-content>
                  <v-list-item-title> out </v-list-item-title>
                </v-list-item-content>
              </template>
              <span>{{ $t("out") }}</span>
            </v-tooltip>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col v-if="open">
        123
        {{ selected && selected.title }}
      </v-col>
    </v-row>
  </v-container>
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
    open: Boolean,
  },
  setup(props, context) {
    const store = useStore();
    const selected: Ref = ref(null);
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
    const items = [
      {
        icon: "mdi-eye",
        title: "menu.watchList",
        to: "/watchList",
        children: watchList,
      },
      {
        icon: "mdi-chart-pie",
        title: "menu.portfolio",
      },
      {
        icon: "mdi-calculator",
        title: "menu.accounting",
      },
      {
        icon: "mdi-cash",
        title: "menu.trades",
      },
      {
        icon: "mdi-presentation",
        title: "menu.alerts",
      },
      {
        icon: "mdi-book-sync-outline",
        title: "menu.drafts",
      },
      {
        icon: "mdi-currency-usd",
        title: "menu.conditionalTrades",
      },
      {
        icon: "mdi-filter-plus-outline",
        title: "menu.filter",
      },
      {
        icon: "mdi-chart-line",
        title: "menu.technical",
      },
      {
        icon: "mdi-file-document-multiple-outline",
        title: "menu.profit",
      },
      {
        icon: "mdi-map-outline",
        title: "menu.marketMap",
      },
      {
        icon: "mdi-cog",
        title: "menu.settings",
      },
      {
        icon: "mdi-chart-bar",
        title: "menu.reports",
        to: "/inspire",
      },
    ];
    return {
      selected,
      items,
    };
  },
});
</script>
