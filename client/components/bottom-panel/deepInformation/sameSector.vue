<template>
  <v-data-table :items="value.data" :headers="headers" dense> </v-data-table>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  computed,
  useStore,
} from "@nuxtjs/composition-api";
import { PaginatedResult, Instrument } from "@/types";

export default defineComponent({
  name: "teammates",
  props: {
    value: Object,
  },
  setup(props, context) {
    const store = useStore();
    const headers = [
      { text:"id", value: "id"},
      { text:"name", value: "code"},
      { text:"last", value: "lastPrice"},
      { text:"closing", value: "closing"},
      { text:"count", value: "totalShares"},
      { text:"volume", value: "totalTrades"},
      { text:"value", value: "totalTradeValue"},
    ];
    return {
      headers,
    };
  },
});
</script>
