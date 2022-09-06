<script setup lang="ts">
import { WatchListColumns } from "~~/types";

const props = defineProps<{
  model: {
    headers: WatchListColumns[];
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
    padding: 0;
    box-sizing: border-box;
  }
}
</style>

<template>
  <tr v-bind="$attrs" class="row-border">
    <td v-for="header in model.headers" :key="header.value" scope="col"
      :class="['tw-text-' + header.align, header.class]">
      <slot :item="model.item" :name="'item.' + header.value">
        {{ model.item[header.value] }}
      </slot>
    </td>
  </tr>
</template>
