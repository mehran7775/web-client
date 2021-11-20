<template>
  <v-container class="login ma-0 pa-0 pt-5" fluid>
    <v-row>
      <v-col></v-col>
      <v-col class="justify-center align-center text-center">
        <nuxt-link to="/about-us" class="logo" />
      </v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col md="4" sm="2"></v-col>
      <v-col md="4" sm="8">
        <v-card>
          <v-card-title class="text-center justify-center">
            {{ $t("login.registration") }}
          </v-card-title>
          <v-form> 

          </v-form>
        </v-card>
      </v-col>
      <v-col md="4" sm="2"></v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>
