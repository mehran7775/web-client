<script setup lang="ts">
import { WatchListColumns } from "~~/types";

const props = withDefaults(defineProps<{
  headers?: Array<WatchListColumns>;
  items?: Array<any>;
  itemKey?: string;
}>(), {
  itemKey: "id",
  headers: () => [] as Array<WatchListColumns>,
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
        <ada-data-table-header-handler :headers="headers">
          <template v-for="header in headers" v-slot:[`header.${header.value}`]>
            <slot :header="header" :name="'header.' + header.value"></slot>
          </template>
        </ada-data-table-header-handler>
      </slot>
      <tbody>
        <slot>
          <ada-data-table-row-handler v-for="item in data" :key="item[itemKey]" :model="{ headers, item }">
            <template v-for="header in headers" v-slot:[`item.${header.value}`]>
              <slot :item="item" :name="'item.' + header.value"></slot>
            </template>
          </ada-data-table-row-handler>
        </slot>
      </tbody>
      <tfoot>
        <slot name="footer"></slot>
      </tfoot>
    </table>
  </div>
</template>
