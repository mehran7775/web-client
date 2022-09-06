<script lang="ts">

import { InstrumentCache, WatchListColumns, DefaultCols } from "@/types";
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
          selected: currentCols.value.findIndex((item) => item?.value == key) != -1,
          value: key,
        }))
        .sort((a, b) => (a.selected ? 0 : 1) - (b.selected ? 0 : 1));
    });
    async function toggleCol(name: string) {
      const tmp = [...currentCols.value];
      const ind = tmp.findIndex((item) => item?.value == name);
      if (ind == -1) {
        const col = new WatchListColumns("instrument." + name, name);
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
.menu-global {
  .ada-button {
    @apply tw-bg-transparent tw-w-9;

    .icon{
      @apply tw-text-primary tw-text-lg;
    }

    &.active{
      @apply tw-bg-primary tw-bg-opacity-10;
      /* .icon {
        @apply
      } */
    }
  }
}
.item {
  @apply tw-h-[32px]  tw-justify-start tw-items-center;
}
.ada-list-item {
  @apply hover:tw-bg-primary hover:tw-bg-opacity-10 tw-cursor-pointer;
}
</style>
<template>
  <ada-menu :active="menu" :mTop="25">
    <template #activator>
      <ada-btn
        @click.stop="()=> menu = !menu" :class="{ active: menu }" v-ada-click-outside="()=> menu = false">
        <ada-icon :size="16">
          mdi-dots-horizontal-circle-outline
        </ada-icon>
      </ada-btn>
    </template>
    <template #items>
      <ada-list class="tw-p-0 tw-m-0" style="{min-height: 256px;}">
        <ada-list-item class="tw-px-2 tw-flex tw-items-center" :value="{ icon: '', title: '' }">
          <span v-text="$t('general.export-excels')"></span>
          <ada-icon class="tw-text-success" :size="16"> mdi-file-excel-outline </ada-icon>
        </ada-list-item>
        <ada-list-item class="tw-px-2 tw-flex tw-items-center" :value="{ icon: '', title: '' }" @click="resetDefault">
          <span v-text="$t('general.default-settings')"></span>
          <ada-icon class="tw-text-info" :size="16"> isax-rotate-left </ada-icon>
        </ada-list-item>
        <hr class="divider tw-border-divider" />
        <ada-list-item v-for="i in items" :key="i.value" @click="toggleCol(i.value)" class="item">
          <ada-icon :class="[i.selected? 'tw-text-primary': 'tw-text-gray4']" :size="22"> isax-tick </ada-icon>
          <span v-text="$t(`instrument.${i.value}`)"></span>
        </ada-list-item>
      </ada-list>
    </template>
  </ada-menu>
</template>

