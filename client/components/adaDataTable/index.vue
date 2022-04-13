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
table {
  line-height: 1.5rem;
}
</style>
<template>
  <table>
    <slot name="header">
      <HeaderHandler :headers="headers"></HeaderHandler>
    </slot>
    <tbody>
      <slot>
        <RowHandler v-for="item in data" :key="item[id]" :model="{ headers, item }">
        </RowHandler>
      </slot>
    </tbody>
    <tfoot>
      <slot name="footer"></slot>
    </tfoot>
  </table>
</template>
