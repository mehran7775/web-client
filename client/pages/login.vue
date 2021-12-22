<template>
  <v-container class="login ma-0 pa-0" fluid>
    <v-row class="ma-0 pa-0">
      <v-col md="6" sm="12" class="ma-0 pt-8 login-col justify-center">
        <nuxt-link to="/about-us" class="logo"></nuxt-link>
        <login :width="322" :input-height="42" />
      </v-col>
      <v-col md="6" sm="0" class="px-8 img-col d-none d-md-block extra">
        <div class="pie pie-1">
          <div class="pie-inner"></div>
        </div>
        <div class="pie pie-2">
          <div class="pie-inner"></div>
        </div>
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

<style lang="sass">
.pie, .pie-inner
  position: absolute
  border-radius: 50%
.pie
  background-color: rgba(255, 255, 255, 0.10)
  height: 593px
  width: 593px
.pie-inner
  background-color: var(--v-primary-base)
  height: 296px
  width: 296px
.pie-1
  top: -296px
  right: -296px
  .pie-inner
    top: 25%
    right: 25%

.pie-2
  bottom: -296px
  left: -296px
  .pie-inner
    bottom: 25%
    left: 25%
</style>

<style lang="sass" scoped>
.extra
  background-color: var(--v-primary-base)
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
  position: relative
  padding: 5% 0
  height: 100vh
  min-height: 600px
  overflow: hidden
.logo
  width: 48px
  height: 54px
  background: url(@/assets/images/logo.png) no-repeat left top
  display: inline-block
  padding: 0

.logo:hover
  background-position: right top
</style>
