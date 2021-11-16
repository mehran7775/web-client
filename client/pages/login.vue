<template>
  <v-container class="login ma-0 pa-0 py-10" fluid>
    <v-row>
      <v-col></v-col>
      <v-col>
        <v-card elevation="0" color="transparent" class="text-center">
          <img alt="logo" src="logo.png" />
        </v-card>
      </v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col md="4" sm="2"></v-col>
      <v-col md="4" sm="8">
        <login color="#3ea4bb" />
      </v-col>
      <v-col md="4" sm="2"></v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import login from "~/components/login.vue";

export default defineComponent({
  components: {
    login,
  },
  setup() {},
});
</script>

<style lang="sass" scoped>
.login
  width: 100%
  overflow-x: hidden
  overflow-y: clip
  background-color: rgb(14, 56, 68)
</style>
