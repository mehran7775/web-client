<template>
  <v-row class="login ma-0 pa-0">
    <v-col
      md="6"
      sm="12"
      class="login-col justify-center"
      style="position: relative"
    >
      <nuxt-link to="/about-us" class="logo"></nuxt-link>
      <login :width="322" :input-height="42" />
      <loading :loading="loading" />
    </v-col>
    <v-col md="6" sm="0" class="img-col d-none d-md-block">
      <div class="pie pie-1"></div>
      <div class="pie pie-2"></div>
      <content-slider :interval="7.5" src="login-slider" />
      <floating-button
        top="calc(50% - 110px)"
        left="8px"
        small
        color="primary lighten-1"
        depressed
      >
        <v-icon> isax-instagram </v-icon>
      </floating-button>
      <floating-button
        top="calc(50% - 66px)"
        left="8px"
        small
        color="primary lighten-1"
        depressed
      >
        <v-icon> isax-whatsapp </v-icon>
      </floating-button>
      <floating-button
        top="calc(50% - 22px)"
        left="8px"
        small
        color="primary lighten-1"
        depressed
      >
        <v-icon> isax-facebook </v-icon>
      </floating-button>
      <floating-button
        top="calc(50% + 22px)"
        left="8px"
        small
        color="primary lighten-1"
        depressed
      >
        <v-icon> mdi-dots-horizontal </v-icon>
      </floating-button>
      <virtual-keyboard />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, computed, useStore } from "@nuxtjs/composition-api";
import { useUser } from "~/composables";

export default defineComponent({
  layout: "public",
  setup() {
    const store = useStore();
    const userManager = useUser(store);
    const loading = userManager.refreshingToken;
    return {
      loading,
    };
  },
});
</script>

<style lang="sass" scoped>
.pie-1
  top: -296px
  right: -296px
.pie-2
  bottom: -296px
  left: -296px

.login
  height: 100%
.login-col
  background-color: white
  height: 100%
  display: flex
  flex-direction: column
  overflow-y: auto
  overflow-x: hidden
@media (min-width: 960px)
  .login-col
    padding: 0 calc(25% - 161px)
@media (max-width: 959px)
  .login-col
    padding: 0 calc(50% - 161px)
.img-col
  position: relative
  padding: 81px 69px 31px 69px
  height: 100%
  min-height: 600px
  overflow: hidden
</style>
