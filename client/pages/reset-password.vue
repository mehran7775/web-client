<template>
  <v-container class="login ma-0 pa-0 pt-5" fluid>
    <v-row>
      <v-col></v-col>
      <v-col class="text-center align-center justify-center">
        <nuxt-link to="/about-us" class="logo" />
      </v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col md="4" sm="2"></v-col>
      <v-col md="4" sm="8">
        <v-card
          elevation="0"
          color="transparent"
          class="login"
          :loading="loading"
        >
          <v-card-title class="justify-center">{{
            $t("login.forget-password")
          }}</v-card-title>
          <v-card-text class="text-center">
            <v-form>
              <v-divider />
              <v-text-field
                v-model="userName"
                :placeholder="$t('user.username')"
                prepend-inner-icon="mdi-account"
                hide-details
                class="mb-2"
              >
              </v-text-field>
              <client-only>
                <vue-hcaptcha
                  sitekey="41a134fc-7604-4ee1-a5df-40c97195491a"
                  language="fa"
                  @verify="captchaResult"
                ></vue-hcaptcha>
              </client-only>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn depressed color="error" @click="otp" width="100%" large dark>
              {{ $t("login.send-sms") }}
            </v-btn>
          </v-card-actions>
          <v-divider />
          <v-card-actions class="text-center justify-center">
            {{ $t("login.alerts") }}
          </v-card-actions>
          <v-divider />
        </v-card>
      </v-col>
      <v-col md="4" sm="2"></v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  components: {},
  setup() {
    function otp() {}
    function captchaResult() {}
    return { otp, captchaResult };
  },
});
</script>
