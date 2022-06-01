<template>
  <v-menu content-class="mt-1 ml-n6" v-model="menu" min-width="164" max-width="164" offset-y bottom offset-x right
    max-height="50vh">
    <template #activator="{ on, attrs }">
      <ada-btn :color="menu ? 'primary' : 'transparent'" class="ma-0 pa-0" v-on="on" v-bind="attrs" :width="24"
        :height="24">
        <ada-icon :color="menu ? 'white' : 'primary'" :size="16">
          mdi-dots-horizontal-circle-outline
        </ada-icon>
      </ada-btn>
    </template>
    <v-list class="pt-0" min-height="256" dense>
      <v-list-item class="px-2 item" @click.stop="" dense>
        <v-list-item-title>
          {{ $t("general.export-excels") }}
        </v-list-item-title>
        <ada-icon color="green" :size="16"> mdi-file-excel-outline </ada-icon>
      </v-list-item>
      <v-list-item class="px-2 item" @click.stop="resetDefault" dense>
        <v-list-item-title>
          {{ $t("general.default-settings") }}
        </v-list-item-title>
        <ada-icon color="info" :size="16"> isax-rotate-left </ada-icon>
      </v-list-item>
      <v-divider class="mx-2" />
      <v-list-item @click.stop="
        () => {
          toggleCol(i.value);
        }
      " :class="['item']" v-for="i in items" :key="i.value">
        <v-list-item-action>
          <ada-icon :color="i.selected ? 'primary' : 'gray4'" :size="16"> isax-tick </ada-icon>
        </v-list-item-action>
        <v-list-item-title>
          {{ $t("instrument." + i.value) }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "#app";
import { InstrumentCache, WatchlistColumns, DefaultCols } from "@/types";
import { useUser } from "~/composables";

export default defineComponent({
  setup() {
    const userManager = useUser();
    const menu = ref(false);
    const user = userManager.me;
    const currentCols = computed(() => user.settings.columns ?? DefaultCols());
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
      return cols
        .map((key) => ({
          selected: currentCols.value.findIndex((item) => item.value == key) != -1,
          value: key,
        }))
        .sort((a, b) => (a.selected ? 0 : 1) - (b.selected ? 0 : 1));
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
      await userManager.update_settings({
        path: "/columns",
        value: tmp,
      });
    }
    async function resetDefault() {
      userManager.setCols(DefaultCols());
      await userManager.update_settings({
        path: "/columns",
        value: DefaultCols(),
      });
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

<style lang="postcss" scoped>
.item {
  height: 32px !important;

  &.selected {
    background-color: rgba(var(--c-primary), 0.05);

    &:hover {
      background-color: rgba(var(--c-default), 0.1);
    }
  }
}
</style>
