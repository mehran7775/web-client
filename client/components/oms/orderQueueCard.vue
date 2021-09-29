<template>
  <v-container>
    <v-row dense>
      <v-col>
        <v-row>
          <v-col>{{ $t("oms.buyCount") }}</v-col>
          <v-col>{{ $t("oms.buyAmount") }}</v-col>
          <v-col>{{ $t("oms.buyPrice") }}</v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-row>
          <v-col>{{ $t("oms.sellCount") }}</v-col>
          <v-col>{{ $t("oms.sellAmount") }}</v-col>
          <v-col>{{ $t("oms.sellPrice") }}</v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col></v-col>
    </v-row>
    <v-row dense>
      <v-col></v-col>
    </v-row>
    <v-row dense>
      <v-col></v-col>
    </v-row>
    <v-row dense>
      <v-col></v-col>
    </v-row>
    <v-row dense>
      <v-col></v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "order-queue-card",
  props: ["instId"],
  setup(props) {},
});
</script>
