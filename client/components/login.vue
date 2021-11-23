<template>
  <v-card elevation="0" color="transparent" class="login" :loading="loading">
    <v-card-title class="justify-center">{{ $t("login.login") }}</v-card-title>
    <v-card-text class="text-center">
      <v-divider />
      <v-text-field
        v-model="userName"
        :placeholder="$t('user.username')"
        prepend-inner-icon="mdi-account"
        dense
        hide-details
      >
      </v-text-field>
      <v-text-field
        v-model="password"
        :placeholder="$t('user.password')"
        :type="showPassword ? 'text' : 'Password'"
        prepend-inner-icon="mdi-lock"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        @keyup.enter="login"
        dense
        hide-details
      >
      </v-text-field>
      <v-select
        dense
        :value="1"
        :items="[
          { value: 1, text: $t('login.static') },
          { value: 2, text: $t('login.otp') },
        ]"
      >
      </v-select>
      <client-only>
        <vue-hcaptcha
          v-if="failedCount > 3"
          sitekey="41a134fc-7604-4ee1-a5df-40c97195491a"
          language="fa"
          @verify="captchaResult"
        ></vue-hcaptcha>
      </client-only>
    </v-card-text>
    <v-card-actions>
      <v-btn depressed color="error" @click="login" width="50%" large dark>
        {{ $t("login.login") }}
      </v-btn>
      <v-btn depressed color="error" to="/registration" width="50%" large dark>
        {{ $t("login.registration") }}
      </v-btn>
    </v-card-actions>
    <v-divider />
    <v-card-actions>
      <v-btn
        depressed
        color="transparent"
        @click="() => $router.push('/reset-password')"
        width="100%"
        small
      >
        {{ $t("login.forget-password") }}
      </v-btn>
    </v-card-actions>
    <v-divider />
    <v-card-actions class="justify-center">
      <v-btn depressed color="transparent" @click="login">
        <v-icon x-large> mdi-apple </v-icon>
      </v-btn>
      <v-btn depressed color="transparent" @click="login">
        <v-icon x-large> adaico-bag-cross </v-icon>
      </v-btn>
      <v-btn depressed color="transparent" @click="login">
        <v-icon x-large> mdi-android </v-icon>
      </v-btn>
      <v-btn depressed color="transparent" @click="login">
        <v-icon x-large> mdi-microsoft </v-icon>
      </v-btn>
    </v-card-actions>
    <v-divider />
    <v-card-actions class="text-center justify-center">
      {{ $t("login.alerts") }}
    </v-card-actions>
    <v-divider />
  </v-card>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";

export default {
  name: "Login",
  props: {
    msg: String,
  },
  data: () => {
    return {
      loading: false,
      showPassword: false,
      userName: null,
      password: null,
      captcha: null,
      snacs: [],
    };
  },
  methods: {
    ...mapActions({
      dologin: "sso/user/login",
    }),
    ...mapMutations({
      alert: "snacks/showMessage",
    }),
    captchaResult(code) {
      this.captcha = code;
    },
    login() {
      const self = this;
      self.loading = true;
      self
        .dologin({
          userName: self.userName,
          password: self.password,
          captcha: self.captcha,
          axios: self.$axios,
        })
        .then(function (data) {
          if (data >= 200 && data < 300) {
            self.$router.push({ path: "/watchlist/" });
            self.alert({
              color: "success",
              content: "login.successful",
            });
          }
        })
        .catch(() => {
          self.alert({
            color: "error",
            content: "login.failed",
          });
        })
        .finally(() => {
          self.loading = false;
        });
    },
  },
  computed: {
    ...mapGetters({ failedCount: "sso/user/failedCount" }),
  },
};
</script>
