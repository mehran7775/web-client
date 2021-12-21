<template>
  <v-container class="login ma-0 pa-0" fluid>
    <v-row class="ma-0 pa-0">
      <v-col md="6" sm="12" class="ma-0 pt-8 login-col justify-center">
        <nuxt-link to="/about-us" class="logo"></nuxt-link>
        <login :width="322" :input-height="42" />
      </v-col>
      <v-col md="6" sm="0" class="px-8 img-col d-none d-md-block extra">
        <content-slider :interval="7.5" src="login-slider" />
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
.extra
  background-color: var(--v-primary-lighten1)
  color: white
.login
  height: 100%
@media (min-width: 960px)
  .login-col
    padding: 0 calc(25% - 161px)

@media (max-width: 959px)
  .login-col
    padding: 0 calc(50% - 161px)

.img-col
  padding: 5% 0
  height: 100vh
  min-height: 600px
.logo
  width: 48px
  height: 54px
  background: url(@/assets/images/logo.png) no-repeat left top
  display: inline-block
  padding: 0

.logo:hover
  background-position: right top
</style>
