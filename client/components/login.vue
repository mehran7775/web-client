<template>
  <v-card
    class="ma-0 pa-0"
    :max-width="width"
    :min-width="width"
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
        tabindex="1"
        ref="userref"
        :height="inputHeight"
        v-model="data.userName"
        prepend-inner-icon="mdi-account"
        @input="checkTries"
        @keyup.enter="
          () => {
            passref.focus();
          }
        "
        hide-details
        outlined
        dense
      />
      <h4 class="my-1">{{ $t("user.password") }}</h4>
      <v-text-field
        tabindex="2"
        ref="passref"
        :height="inputHeight"
        v-model="data.password"
        :type="showPassword ? 'text' : 'Password'"
        prepend-inner-icon="mdi-lock"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        @keyup.enter="
          () => {
            if (false) login(data);
            else captcharef.focus();
          }
        "
        hide-details
        outlined
        dense
      />
      <div
        :class="{
          'justify-end my-1': true,
          'text-left': rtl,
          'text-right': !rtl,
        }"
      >
        <nuxt-link to="/reset-password">
          {{ $t("login.forget-password") }}
        </nuxt-link>
      </div>
      <div v-if="true">
        <h4 class="my-1">{{ $t("login.captcha") }}</h4>
        <v-text-field
          tabindex="3"
          ref="captcharef"
          class="captcha"
          v-model="data.captcha"
          @keyup.enter="
            () => {
              login(data);
            }
          "
          hide-details
          outlined
          dense
        >
          <template #append>
            <v-img :src="captchaUrl" class="ma-0 pa-0 d-inline-block"> </v-img>
            <v-icon @click="refreshCaptcha"> mdi-refresh </v-icon>
          </template>
        </v-text-field>
      </div>
      <v-radio-group v-model="data.passwordType" row>
        <v-radio
          v-for="(item, index) in [
            { value: 1, text: $t('login.static') },
            { value: 2, text: $t('login.otp') },
          ]"
          :ripple="false"
          :key="item.value"
          :label="item.text"
          :value="item.value"
          on-icon="mdi-check-circle"
          off-icon="mdi-check-circle-outline"
          :class="{
            'radio-ckeck ma-0 pa-2': true,
            'me-1': index != 1, //last index
          }"
          style="width: calc(50% - 2px)"
        />
      </v-radio-group>
      <!-- <client-only>
        <vue-hcaptcha
          v-if="failedCount > 3"
          sitekey="41a134fc-7604-4ee1-a5df-40c97195491a"
          language="fa"
          @verify="captchaResult"
        ></vue-hcaptcha>
      </client-only> -->
      <v-btn
        class="font-weight-bold my-1"
        depressed
        color="primary"
        @click="login(data)"
        width="100%"
        :height="inputHeight"
      >
        {{ $t("login.login") }}
      </v-btn>
    </v-form>
    <v-btn
      class="font-weight-bold my-1"
      depressed
      color="primary"
      to="/registration"
      width="100%"
      :height="inputHeight"
      outlined
    >
      {{ $t("login.registration") }}
    </v-btn>

    <div
      v-html="$t('login.alerts')"
      class="text-center justify-center font-12"
    ></div>
  </v-card>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  Ref,
  reactive,
  onMounted,
  useStore,
  useContext,
  ComputedRef,
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

    const userref: Ref<any> = ref(null);
    const passref: Ref<any> = ref(null);
    const captcharef: Ref<any> = ref(null);
    const formatter: ComputedRef<Intl.NumberFormat> = computed(
      () => store.getters["formatter"] as Intl.NumberFormat
    );

    const loading: Ref<boolean> = ref(false);
    const showPassword: Ref<boolean> = ref(false);
    const data: Ref<Login> = ref(new Login("", "", ""));
    const snacs = reactive([]);
    const i18n = useI18n();
    const captcha =
      process.env.VUE_APP_Host + "sso/captcha?width=100&height=32&r=";
    const captchaUrl = ref(captcha);

    const failedCount = computed(() => store.getters["sso/user/tryCount"]);
    const rtl = computed(() => store.getters["rtl"]);

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
        refreshCaptcha();
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
    function refreshCaptcha() {
      captchaUrl.value = captcha + Math.random() * 1000000;
    }

    onMounted(() => {
      userref.value?.focus();
    });

    return {
      login,
      snack,
      captchaResult,
      checkTries,
      refreshCaptcha,
      captchaUrl,
      rtl,
      formatter,
      failedCount,
      loading,
      showPassword,
      data,
      snacs,
      userref,
      passref,
      captcharef,
    };
    //TODO Remove in vue3
    function useI18n() {
      return context.root.$i18n;
    }
  },
});
</script>

<style lang="sass">
a
  text-decoration: none
.font-12
  font-size: 12px
.captcha
  .v-input__append-inner
    margin-top: 3px !important
.radio-ckeck
  border-radius: 5px
  width: calc( 50% - 8px )
  background-color: var(--v-default-lighten3)
  font-weight: bold
  &.v-item--active
    background-color: var(--v-primary-lighten5)
    label
      color: var(--v-primary-base)
  .v-input--selection-controls__input
    width: auto
    .v-icon
      font-size: inherit
</style>
