<template>
  <v-container class="text-center ma-0 py-0" fluid>
    <v-row v-if="!hideHeaders" dense>
      <v-col class="success--text">
        {{ $t("oms.buy") }}
      </v-col>
      <v-col class="error--text">
        {{ $t("oms.sell") }}
      </v-col>
    </v-row>
    <v-row v-show="!hideHeaders" class="text-no-wrap" dense>
      <v-col
        :class="{
          'd-none d-md-block': responsive,
        }"
        >{{ $t("oms.count") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
        }"
        >{{ $t("oms.amount") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
        }"
        >{{ $t("oms.percent") }}</v-col
      >
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.count-short")
      }}</v-col>
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.amount-short")
      }}</v-col>
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.percent-short")
      }}</v-col>

      <v-col></v-col>

      <v-col
        :class="{
          'd-none d-md-block': responsive,
        }"
        >{{ $t("oms.count") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
        }"
        >{{ $t("oms.amount") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
        }"
        >{{ $t("oms.percent") }}</v-col
      >
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.count-short")
      }}</v-col>
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.amount-short")
      }}</v-col>
      <v-col v-if="responsive" class="d-md-none">{{
        $t("oms.percent-short")
      }}</v-col>
    </v-row>
    <v-row class="striped" dense>
      <v-col>1</v-col>
      <v-col>1</v-col>
      <v-col>1%</v-col>
      <v-col class="blue--text">{{ $t("user.personality.real") }}</v-col>
      <v-col>1</v-col>
      <v-col>1</v-col>
      <v-col>1%</v-col>
    </v-row>
    <v-row class="striped" dense>
      <v-col>1</v-col>
      <v-col>1</v-col>
      <v-col>1%</v-col>
      <v-col class="blue--text">{{ $t("user.personality.legal") }}</v-col>
      <v-col>1</v-col>
      <v-col>1</v-col>
      <v-col>1%</v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "legal-real-card",
  props: {
    insId: Number,
    "hide-headers": Boolean,
    responsive: Boolean,
  },
  setup() {},
});
</script>
