<template>
  <v-container fluid>
    <v-row dense>
      <v-col class="d-flex flex-row ma-0 pa-0" style="overflow-x: scroll">
        <v-card
          class="me-1 mb-1"
          min-width="430"
          max-width="430"
          v-for="item in instruments"
          :key="item.id"
        >
          <v-toolbar dense flat color="secondary" dark>
            {{ item.name }}
            <v-spacer />
            <v-btn depressed height="24px" color="success" dark x-large>
              {{ $t("oms.buy") }}
            </v-btn>
            <v-btn
              depressed
              height="24px"
              color="error"
              dark
              x-large
              class="ms-1 pa-0"
            >
              {{ $t("oms.sell") }}
            </v-btn>
            <v-icon
              class="ms-1"
              color="error"
              @click="() => close(item.id)"
              small
            >
              mdi-close-circle-outline
            </v-icon>
          </v-toolbar>
          <v-card-text class="text-caption ma-0 pa-0">
            <order-queue-card :insId="item.id" />
            <legal-real-card />
            <instrument-card :insId="item.id" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, useStore, computed } from "@nuxtjs/composition-api";
import instrumentCard from "@/components/oms/instrumentCard.vue";
import OrderQueueCard from "@/components/oms/orderQueueCard.vue";
import LegalRealCard from "@/components/oms/legalRealCard.vue";

export default defineComponent({
  components: {
    instrumentCard,
    OrderQueueCard,
    LegalRealCard,
  },
  setup() {
    const store = useStore();
    const instruments = computed(() => store.getters["instruments/getFocus"]);
    function close(id: number) {
      store.commit("instruments/removeFocus", id);
      store.commit("instruments/stopWatchQueue", id);
    }
    return {
      close,
      instruments,
    };
  },
});
</script>

