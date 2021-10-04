<template>
  <v-container class="text-center">
    <v-row dense>
      <v-col>
        {{ $t("oms.buy") }}
      </v-col>
      <v-col>
        {{ $t("oms.sell") }}
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-row>
          <v-col>{{ $t("oms.count") }}</v-col>
          <v-col>{{ $t("oms.amount") }}</v-col>
          <v-col>{{ $t("oms.price") }}</v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-row>
          <v-col>{{ $t("oms.count") }}</v-col>
          <v-col>{{ $t("oms.amount") }}</v-col>
          <v-col>{{ $t("oms.price") }}</v-col>
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
