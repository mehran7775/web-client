<template>
  <v-card elevation="0" color="transparent" class="login" :loading="loading">
    <v-card-title class="justify-center">{{ $t("login.login") }}</v-card-title>
    <v-card-text class="text-center">
      <v-divider />
      <v-text-field
        v-model="data.userName"
        :placeholder="$t('user.username')"
        prepend-inner-icon="mdi-account"
        @input="checkTries"
        dense
        hide-details
      >
      </v-text-field>
      <v-text-field
        v-model="data.password"
        :placeholder="$t('user.password')"
        :type="showPassword ? 'text' : 'Password'"
        prepend-inner-icon="mdi-lock"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        @keyup.enter="login(data)"
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
      <v-btn
        depressed
        color="error"
        @click="login(data)"
        width="50%"
        large
        dark
      >
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

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  Ref,
  reactive,
  watch,
  useStore,
  useContext,
} from "@nuxtjs/composition-api";
import { AxiosError } from "axios";
import { Snack } from "~/store/snacks";
import { Login } from "~/types";
import { ErrorExtractor } from "~/utils/error";

export default defineComponent({
  name: "Login",
  props: {
    msg: String,
  },
  setup(props, context) {
    const store = useStore();
    const ctx = useContext();
    const loading: Ref<boolean> = ref(false);
    const showPassword: Ref<boolean> = ref(false);
    const data: Ref<Login> = ref(new Login("", "", ""));
    const snacs = reactive([]);
    const i18n = useI18n();

    const failedCount = computed(() => store.getters["sso/user/tryCount"]);
    async function login(data: Login) {
      loading.value = true;
      try {
        const res = await store.dispatch(
          "sso/user/login",
          Object.assign({}, data, { axios: ctx.$axios })
        );
        if (res >= 200 && res < 300) {
          ctx.redirect({ path: "/watchlist/" });
          snack(new Snack("login.successful", "success"));
        }
      } catch (err) {
        const error = ErrorExtractor(err as AxiosError);
        if (error.detail.length == 0)
          snack(new Snack("errors." + error.code, "error"));
        else {
          let res = "";
          for (let e in error.detail) {
            res += i18n.t(error.detail[e].type) + "\r\n";
          }
          snack(new Snack(res, "error"));
        }
      } finally {
        loading.value = false;
      }
    }
    function snack(data: Snack) {
      store.commit("snacks/showMessage", data);
    }
    function captchaResult(code: string) {
      data.value.captcha = code;
    }

    function checkTries(val: string) {
      store.dispatch("sso/user/checkTries", val);
    }

    return {
      login,
      snack,
      captchaResult,
      checkTries,
      failedCount,
      loading,
      showPassword,
      data,
      snacs,
    };
    //TODO Remove in vue3
    function useI18n() {
      return context.root.$i18n;
    }
  },
});
</script>