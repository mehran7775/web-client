<template>
  <v-menu v-model="menu" min-width="164" offset-y max-height="50vh">
    <template #activator="{ on, attrs }">
      <v-btn
        :color="menu ? 'primary' : 'transparent'"
        class="ma-0 pa-0"
        v-on="on"
        v-bind="attrs"
        width="24"
        height="24"
        depressed
      >
        <v-icon :color="menu ? 'white' : 'primary'" size="14">
          mdi-dots-horizontal-circle-outline
        </v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item class="px-2 item" @click.stop="">
        <v-list-item-title>
          {{ $t("general.export-excels") }}
        </v-list-item-title>
        <v-icon color="green" small> mdi-file-excel-outline </v-icon>
      </v-list-item>
      <v-list-item class="px-2 item" @click.stop="resetDefault">
        <v-list-item-title>
          {{ $t("general.default-settings") }}
        </v-list-item-title>
        <v-icon color="info" small> isax-rotate-left </v-icon>
      </v-list-item>
      <v-divider />
      <v-list-item
        @click.stop="
          () => {
            toggleCol(i.value);
          }
        "
        :class="['item', i.selected ? 'selected' : '']"
        v-for="i in items"
        :key="i.value"
      >
        <v-list-item-action>
          <v-icon :color="i.selected ? 'primary' : 'gray4'" small>
            isax-tick
          </v-icon>
        </v-list-item-action>
        <v-list-item-title>
          {{ $t("instrument." + i.value) }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import {
  defineComponent,
  useStore,
  computed,
  ref,
} from "@nuxtjs/composition-api";
import { User, InstrumentCache, WatchlistColumns, DefaultCols } from "@/types";

export default defineComponent({
  setup() {
    const store = useStore();
    const menu = ref(false);
    const user = computed(() => store.getters["sso/user/me"] as User);
    const currentCols = computed(
      () => user.value.settings.columns ?? DefaultCols()
    );
    const blackList = [
      "side",
      "priceChange",
      "minQuantityPerOrder",
      "maxQuantityPerOrder",
      "maxAllowedPrice",
      "minAllowedPrice",
      "instrumentId",
      "instrumentCode",
    ];
    const cols = Object.keys(new InstrumentCache()).filter(
      (item) => blackList.indexOf(item) == -1
    );
    const items = computed(() => {
      return cols.map((key) => ({
        selected:
          currentCols.value.findIndex((item) => item.value == key) != -1,
        value: key,
      }));
    });
    async function toggleCol(name: string) {
      const tmp = [...currentCols.value];
      const ind = tmp.findIndex((item) => item.value == name);
      if (ind == -1) {
        const col = new WatchlistColumns("instrument." + name, name);
        switch (name) {
          case "name":
            col.align = "start";
            break;
          case "status":
            col.width = "123px";
        }
        tmp.push(col);
      } else {
        tmp.splice(ind, 1);
      }
      store.commit("sso/user/setCols", tmp);
      await store.dispatch("sso/user/save_settings");
    }
    async function resetDefault() {
      store.commit("sso/user/setCols", DefaultCols());
      await store.dispatch("sso/user/save_settings");
    }
    return {
      menu,
      items,
      toggleCol,
      resetDefault,
    };
  },
});
</script>

<style lang="sass" scoped>
.item
  height: 32px !important
  &.selected
    background-color: rgba($c-primary,0.05)
    &:hover
      background-color: rgba($c-default,0.1)
</style>
