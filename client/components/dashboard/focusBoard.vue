<template>
  <v-container>
    <v-row>
      <v-col v-if="instruments.length > 0" class="d-flex flex-row" style="overflow-x: scroll">
        <v-card min-width="39%" v-for="item in instruments" :key="item.id">
          <instrument-card :insId="item.id" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, useStore } from "@nuxtjs/composition-api";
import instrumentCard from "../oms/instrumentCard.vue";

export default defineComponent({
  components: { instrumentCard },
  name: "focus-board",
  setup(props) {
    const store = useStore();

    const instruments = computed(() => store.getters["instruments/getFocus"]);
    return {
      instruments,
    };
  },
});
</script>
