<template>
  <v-card
    class="ma-0 pa-0"
    :max-width="width"
    elevation="0"
    color="transparent"
    :loading="loading"
  >
    <v-card-title class="ma-0 pa-0 justify-start font-weight-bold">{{
      $t("login.title")
    }}</v-card-title>
    <v-form>
      <h4 class="my-1">{{ $t("user.username") }}</h4>
      <v-text-field
        :height="inputHeight"
        v-model="data.userName"
        prepend-inner-icon="mdi-account"
        @input="checkTries"
        hide-details
        outlined
        dense
      />
      <h4 class="my-1">{{ $t("user.password") }}</h4>
      <v-text-field
        :height="inputHeight"
        v-model="data.password"
        :type="showPassword ? 'text' : 'Password'"
        prepend-inner-icon="mdi-lock"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        @keyup.enter="login(data)"
        hide-details
        outlined
        dense
      />
      <div class="justify-end">
        <nuxt-link to="/reset-password">
          {{ $t("login.forget-password") }}
        </nuxt-link>
      </div>
      <div>
        <v-radio-group v-model="data.passwordType" row>
          <v-radio
            v-for="item in [
              { value: 1, text: $t('login.static') },
              { value: 2, text: $t('login.otp') },
            ]"
            :key="item.value"
            :label="item.text"
            :value="item.value"
            on-icon="mdi-check-circle"
            off-icon="mdi-check-circle-outline"
            class="radio-ckeck ma-0 mx-1 pa-2"
          />
        </v-radio-group>
      </div>
      <client-only>
        <vue-hcaptcha
          v-if="failedCount > 3"
          sitekey="41a134fc-7604-4ee1-a5df-40c97195491a"
          language="fa"
          @verify="captchaResult"
        ></vue-hcaptcha>
      </client-only>
    </v-form>
    <v-card-actions>
      <v-btn
        class="font-weight-bold"
        depressed
        color="primary"
        @click="login(data)"
        width="100%"
        :height="inputHeight"
      >
        {{ $t("login.login") }}
      </v-btn>
    </v-card-actions>
    <v-card-actions>
      <v-btn
        class="font-weight-bold"
        depressed
        color="primary"
        to="/registration"
        width="100%"
        :height="inputHeight"
        outlined
      >
        {{ $t("login.registration") }}
      </v-btn>
    </v-card-actions>
    <v-card-actions class="text-center justify-center">
      {{ $t("login.alerts") }}
    </v-card-actions>
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
    width: Number,
    inputHeight: Number,
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

<style lang="sass">
.radio-ckeck
  border-radius: 5px
  width: calc( 50% - 8px )
  background-color: var(--v-primary-lighten5)
  font-weight: bold
  &.v-item--active
    label
      color: var(--v-primary-base)
  .v-input--selection-controls__input
    width: auto
    .v-icon
      font-size: inherit
    

</style>
