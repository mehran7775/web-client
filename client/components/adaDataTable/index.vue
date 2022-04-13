<script setup lang="ts">
import { WatchlistColumns } from "~~/types";

const props = defineProps<{
  columns: Array<WatchlistColumns>;
  data: Array<object>;
}>();
</script>
<style lang="postcss"></style>
<template>
  <table>
    <thead>
      <slot name="header"></slot>
    </thead>
    <tbody>
      <slot></slot>
    </tbody>
    <tfoot>
      <slot name="footer"></slot>
    </tfoot>
  </table>
</template>
