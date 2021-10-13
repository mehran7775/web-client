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
import { PaginatedResult } from "@/types/collection";
import { Instrument } from "@/types/oms";

export default defineComponent({
  name: "teammates",
  props: {
    value: Object,
  },
  setup(props, context) {
    const store = useStore();
    const headers = [
      { text:"id", value: "id"},
      { text:"name", value: "name"},
      { text:"last", value: "last"},
      { text:"closeing", value: "closeing"},
      { text:"count", value: "count"},
      { text:"volume", value: "volume"},
      { text:"value", value: "value"},
    ];
    return {
      headers,
    };
  },
});
</script>
