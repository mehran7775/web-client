<template>
  <div class="2xl:tw-container">
    <div class="tw-grid tw-grid-cols-1">
      <client-only placeholder="Loading...">
        <printer />
      </client-only>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "#app";
import printer from "@/components/websocket_printer.vue";

export default defineComponent({
  layout: "public",
  components: {
    printer,
  },
  setup() { },
});
</script>

