<template>
  <v-container fluid>
    <v-row dense>
      <v-col> {{ $t("user.personality.real") }} </v-col>
      <v-col> {{ $t("user.personality.legal") }} </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        {{ insId }}
      </v-col>
    </v-row>
    <v-row dense> <v-col></v-col></v-row>
    <v-row dense> <v-col></v-col></v-row>
    <v-row dense> <v-col></v-col></v-row>
    <v-row dense> <v-col></v-col></v-row>
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
