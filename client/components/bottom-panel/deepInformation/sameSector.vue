<template>
  <v-data-table :items="value.data" :headers="headers" dense> </v-data-table>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from "@vue/composition-api";
import { PaginatedResult, Instrument } from "@/types";
import { useNuxtApp } from "#app";

export default defineComponent({
  name: "teammates",
  props: {
    value: Object,
  },
  setup() {
    const headers = [
      { text: "id", value: "id" },
      { text: "name", value: "code" },
      { text: "last", value: "lastPrice" },
      { text: "closing", value: "closing" },
      { text: "count", value: "totalShares" },
      { text: "volume", value: "totalTrades" },
      { text: "value", value: "totalTradeValue" },
    ];
    return {
      headers,
    };
  },
});
</script>
