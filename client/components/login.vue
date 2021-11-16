<template>
  <v-card elevation="0" color="transparent" class="login">
    <v-card-title :style="{ color: color }" class="justify-center">{{
      $t("login.login")
    }}</v-card-title>
    <v-card-text
      :style="{ color: color }"
      class="text-center"
    >
      <v-divider />
      <v-text-field
        :color="color"
        v-model="userName"
        :label="$t('user.username')"
        prepend-inner-icon="mdi-account"
      >
      </v-text-field>
      <v-text-field
        :color="color"
        v-model="password"
        :label="$t('user.password')"
        :type="showPassword ? 'text' : 'Password'"
        prepend-inner-icon="mdi-lock"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        @keyup.enter="login"
        dense
      >
      </v-text-field>
      <v-text-field
        :color="color"
        v-model="userName"
        :label="$t('user.captcha')"
        prepend-inner-icon="mdi-qrcode"
      ></v-text-field>
      <v-select dense value="ایستا" :items="['ایستا', 'پویا']"> </v-select>
    </v-card-text>
    <v-card-actions>
      <v-btn depressed color="error" @click="login" width="50%" large dark>
        {{ $t("login.login") }}
      </v-btn>
      <v-btn depressed color="error" @click="register" width="50%" large dark>
        {{ $t("login.register") }}
      </v-btn>
    </v-card-actions>
    <v-divider />
    <v-card-actions :style="{ color: color }">
      <v-btn depressed color="transparent" @click="login" width="100%" large>
        {{ $t("login.forget-password") }}
      </v-btn>
    </v-card-actions>
    <v-divider />
    <v-card-actions class="justify-center" :style="{ color: color }">
      <v-btn depressed color="transparent" @click="login" >
        <v-icon x-large>
          mdi-apple
        </v-icon>
      </v-btn>
      <v-btn depressed color="transparent" @click="login" >
        <v-icon x-large>
          adaico-bag-cross
        </v-icon>
      </v-btn>
      <v-btn depressed color="transparent" @click="login" >
        <v-icon x-large>
          mdi-android
        </v-icon>
      </v-btn>
      <v-btn depressed color="transparent" @click="login" >
        <v-icon x-large>
          mdi-microsoft
        </v-icon>
      </v-btn>
    </v-card-actions>
    <v-divider />
    <v-card-actions class="text-center justify-center" :style="{ color: 'white' }">
        {{ $t("login.alerts") }}
    </v-card-actions>
    <v-divider />
    <v-card-actions :style="{ color: color }">
      <v-btn depressed color="transparent" @click="login" width="100%" large>
        {{ $t("login.about-us") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapMutations } from "vuex";

export default {
  name: "Login",
  props: {
    msg: String,
    color: {
      type: String,
      default: "inherit",
    },
  },
  data: () => {
    return {
      showPassword: false,
      userName: null,
      password: null,
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
    register() {},
    login() {
      const self = this;
      self
        .dologin({
          userName: self.userName,
          password: self.password,
          axios: self.$axios,
        })
        .then(
          function (data) {
            if (data >= 200 && data < 300) {
              self.$router.push({ path: "/watchlist/" });
              self.alert({
                color: "success",
                content: "login.successful",
              });
            } else {
              self.alert({
                color: "error",
                content: "login.failed",
              });
            }
          },
          function (data) {}
        );
    },
  },
};
</script>

<style lang="sass">
.login
  .v-input,
  .theme--light
    &.v-icon,
    &.v-label,
    &.v-input,
    &.v-btn,
    &.v-select
      .v-select
        &__selections
          color: inherit
      color: inherit
  .theme--dark
    color: inherit
</style>
