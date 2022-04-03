<template>
  <v-container>
    <client-only placeholder="Loading...">
      <printer />
    </client-only>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "#app";
import printer from "@/components/websocket_printer.vue";

export default defineComponent({
  layout: "public",
  components: {
    printer,
  },
  setup() {},
});
</script>

