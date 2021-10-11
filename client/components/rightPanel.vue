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
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content v-if="!selected">
              <v-list-item-title v-text="$t(item.title)" />
            </v-list-item-content>
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
    open: Boolean
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
