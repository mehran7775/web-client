<script setup lang="ts">
import { WatchlistColumns } from "~~/types";

const props = defineProps<{
  model: {
    headers: WatchlistColumns[];
    item: any;
  };
}>();
</script>

<style lang="postcss" scoped>
.row-border {
  position: relative;
  border: none;
  height: var(--row-height);
  -webkit-user-drag: element;

  td {
    height: var(--row-height);
    border: none;
    border-bottom: 1px solid #e0e0e0;
  }
}
</style>

<template>
  <tr v-on="$listeners" v-bind="$attrs" class="row-border">
    <td v-for="header in model.headers" :key="header.value" scope="col"
      :class="['tw-text-' + header.align, header.class]">
      <slot :item="model.item" :name="'item.' + header.value">
        {{ model.item[header.value] }}
      </slot>
    </td>
  </tr>
</template>
