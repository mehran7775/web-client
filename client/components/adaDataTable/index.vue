<script setup lang="ts">
import { computed } from "#app";
import { WatchlistColumns } from "~~/types";
import HeaderHandler from "./headerHandler.vue";
import RowHandler from "./rowHandler.vue";

const props = withDefaults(defineProps<{
  headers?: Array<WatchlistColumns>;
  items?: Array<any>;
  itemKey?: string;
}>(), {
  itemKey: "id",
  headers: () => [] as Array<WatchlistColumns>,
});

const data = computed(() => props.items);
</script>
<style scoped lang="postcss">
.ada-dataTable {
  @apply tw-w-full;
  overflow-y: auto;
}
</style>
<template>
  <div>
    <table class="ada-dataTable">
      <slot name="header">
        <HeaderHandler :headers="headers">
          <template v-for="header in headers" :slot="'header.' + header.value">
            <slot :header="header" :name="'header.' + header.value"></slot>
          </template>
        </HeaderHandler>
      </slot>
      <tbody>
        <slot>
          <RowHandler v-for="item in data" :key="item[itemKey]" :model="{ headers, item }">
            <template v-for="header in headers" :slot="'item.' + header.value">
              <slot :item="item" :name="'item.' + header.value"></slot>
            </template>
          </RowHandler>
        </slot>
      </tbody>
      <tfoot>
        <slot name="footer"></slot>
      </tfoot>
    </table>
  </div>
</template>
