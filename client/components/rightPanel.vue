<template>
  <v-list v-model="selected" dense>
    <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
      <v-list-item-action>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title v-text="$t(item.title)" />
        <v-list-item-group v-if="item.children">
          <v-list-item
            v-for="subitem in item.children.value"
            :key="subitem.title"
            :to="subitem.to"
            @click="subitem.click ? subitem.click() : null"
            router
            exact
          >
            <v-list-item-action>
              <v-icon>{{ subitem.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="subitem.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list-item-content>
    </v-list-item>
  </v-list>
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
  emits: ["watchList.edit"],
  setup(props, { emit }) {
    const store = useStore();
    const selected: Ref = ref(null);
    const watchList = computed(() => {
      const lists = store.getters["user/watchList"];
      const res = [
        {
          icon: "mdi-pen",
          click: emit("watchList.edit"),
        },
      ];
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
