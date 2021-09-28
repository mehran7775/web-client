<template>
  <v-container fluid>
    <v-row>
      <v-col> {{ $t("user.personality.real") }} </v-col>
      <v-col> {{ $t("user.personality.legal") }} </v-col>
    </v-row>
    <v-row>
      <v-col>
        {{ insId }}
      </v-col>
    </v-row>
    <v-row> <v-col></v-col></v-row>
    <v-row> <v-col></v-col></v-row>
    <v-row> <v-col></v-col></v-row>
    <v-row> <v-col></v-col></v-row>
  </v-container>
</template>

<script>
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "legal-real-card",
  props: ["insId"],
  setup() {},
});
</script>
