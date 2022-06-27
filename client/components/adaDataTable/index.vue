<script setup lang="ts">
import { computed } from "#app";
import { WatchlistColumns } from "~~/types";
import HeaderHandler from "./headerHandler.vue";
import RowHandler from "./rowHandler.vue";

const props = defineProps<{
  headers: Array<WatchlistColumns>;
  items: Array<any>;
  id: string;
}>();

const data = computed(() => props.items);
</script>
<style scoped lang="postcss">
.ada-dataTable {
  >table {
    @apply tw-w-full;
    overflow-y: auto;
  }
}
</style>
<template>
  <div class="ada-dataTable">
    <table>
      <slot name="header">
        <HeaderHandler :headers="headers"></HeaderHandler>
      </slot>
      <tbody>
        <slot>
          <RowHandler v-for="item in data" :key="item[id]" :model="{ headers, item }">
            <template v-for="header in headers" :slot="'item.' + header.value">
              <slot :item="item" :name="'item.' + header.value" />
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
