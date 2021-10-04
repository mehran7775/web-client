<template>
  <v-container fluid>
    <v-row dense>
      <v-col class="green lighten-5 text-no-wrap text-caption">
        <v-row>
          <v-col cols="4">{{ $t("oms.buyCount") }}</v-col>
          <v-col cols="4">{{ $t("oms.buyAmount") }}</v-col>
          <v-col cols="4">{{ $t("oms.percent") }}</v-col>
        </v-row>
      </v-col>
      <v-col class="red lighten-5 text-no-wrap text-caption">
        <v-row>
          <v-col cols="4">{{ $t("oms.sellCount") }}</v-col>
          <v-col cols="4">{{ $t("oms.sellAmount") }}</v-col>
          <v-col cols="4">{{ $t("oms.percent") }}</v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>1</v-col>
      <v-col>1</v-col>
      <v-col>1</v-col>
      <v-col class="blue--text" >{{ $t("user.personality.real") }}</v-col>
      <v-col>1</v-col>
      <v-col>1</v-col>
      <v-col>1</v-col>
    </v-row>
    <v-row dense>
      <v-col>1</v-col>
      <v-col>1</v-col>
      <v-col>1</v-col>
      <v-col class="blue--text" >{{ $t("user.personality.legal") }}</v-col>
      <v-col>1</v-col>
      <v-col>1</v-col>
      <v-col>1</v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "legal-real-card",
  props: ["insId"],
  setup() {},
});
</script>
