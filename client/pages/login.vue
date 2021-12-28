<template>
  <v-container class="login ma-0 pa-0" fluid>
    <v-row class="ma-0 pa-0">
      <v-col md="6" sm="12" class="login-col justify-center">
        <nuxt-link to="/about-us" class="logo"></nuxt-link>
        <login :width="322" :input-height="42" />
      </v-col>
      <v-col md="6" sm="0" class="img-col d-none d-md-block">
        <div class="pie pie-1">
          <div class="pie-inner"></div>
        </div>
        <div class="pie pie-2">
          <div class="pie-inner"></div>
        </div>
        <content-slider :interval="7.5" src="login-slider" />
        <floating-button top="calc(50% - 132px)" left="8px" small color="primary lighten-1" depressed>
          <v-icon> mdi-instagram </v-icon>
        </floating-button>
        <floating-button top="calc(50% - 88px)" left="8px" small color="primary lighten-1" depressed>
          <v-icon> mdi-whatsapp </v-icon>
        </floating-button>
        <floating-button top="calc(50% - 44px)" left="8px" small color="primary lighten-1" depressed>
          <v-icon> mdi-facebook </v-icon>
        </floating-button>
        <floating-button top="50%" left="8px" small color="primary lighten-1" depressed>
          <v-icon> mdi-dots-horizontal </v-icon>
        </floating-button>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  layout: "public",
  setup() {},
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
  height: 100vh
  display: flex
  flex-direction: column
@media (min-width: 960px)
  .login-col
    padding: 0 calc(25% - 161px)
@media (max-width: 959px)
  .login-col
    padding: 0 calc(50% - 161px)
.img-col
  position: relative
  padding: 81px 69px 31px 69px
  height: 100vh
  min-height: 600px
  overflow: hidden
</style>
