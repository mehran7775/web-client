<template>
  <v-card
    class="ma-0 pa-0"
    :max-width="width"
    :min-width="width"
    elevation="0"
    color="transparent"
    :loading="loading"
  >
    <v-card-title class="ma-0 mt-2 pa-0 justify-start font-weight-bold">{{
      $t("login.title")
    }}</v-card-title>
    <v-form ref="frm">
      <span class="mt-6 mar-b-6">{{ $t("user.username") }}</span>
      <v-text-field
        tabindex="1"
        ref="userref"
        :height="inputHeight"
        v-model="data.userName"
        prepend-inner-icon="adaico-user"
        :rules="[rules.required]"
        @input="checkTries"
        @keyup.enter="
          () => {
            passref.focus();
          }
        "
        hide-details
        outlined
        dense
        validate-on-blur
      >
        <template #append>
          <v-icon> adaico-keyboard </v-icon>
        </template>
      </v-text-field>
      <div v-if="userref && !userref.valid" class="pt-2 error--text">
        <div
          v-for="item in userref.validations"
          :key="item"
          style="font-size: 10px"
        >
          <v-icon color="error" size="17"> mdi-alert-circle-outline</v-icon>
          <span style="display: inline-block">
            {{ $t(item) }}
          </span>
        </div>
      </div>
      <span class="mt-3 mar-b-6">{{ $t("user.password") }}</span>
      <v-text-field
        tabindex="2"
        ref="passref"
        :height="inputHeight"
        v-model="data.password"
        :type="showPassword ? 'text' : 'Password'"
        prepend-inner-icon="adaico-lock"
        @keyup.enter="
          () => {
            if (false) login(data);
            else captcharef.focus();
          }
        "
        :class="{ 'pass-star': !showPassword }"
        :rules="[rules.required]"
        hide-details
        outlined
        dense
        validate-on-blur
      >
        <template #append>
          <v-icon
            class="me-3"
            :color="showPassword ? 'primary' : null"
            @click="showPassword = !showPassword"
          >
            adaico-eye
          </v-icon>
          <v-icon> adaico-keyboard </v-icon>
        </template>
      </v-text-field>
      <div v-if="passref && !passref.valid" class="pt-2 error--text">
        <div
          v-for="item in passref.validations"
          :key="item"
          style="font-size: 10px"
        >
          <v-icon color="error" size="17"> mdi-alert-circle-outline</v-icon>
          <span style="display: inline-block">
            {{ $t(item) }}
          </span>
        </div>
      </div>
      <div
        :class="{
          'justify-end mt-1': true,
          'text-left': rtl,
          'text-right': !rtl,
        }"
        style="font-size:10px;"
      >
        <nuxt-link to="/reset-password">
          {{ $t("login.forget-password") }}
        </nuxt-link>
      </div>
      <div v-if="true" class="ma-0 pa-0 mt-1 mb-4">
        <span class="mar-b-6">{{ $t("login.captcha") }}</span>
        <v-text-field
          tabindex="3"
          ref="captcharef"
          class="captcha"
          v-model="data.captcha"
          :rules="[rules.required]"
          @keyup.enter="
            () => {
              login(data);
            }
          "
          hide-details
          outlined
          dense
          validate-on-blur
        >
          <template #append>
            <v-img :src="captchaUrl" class="ma-0 me-3 pa-0 d-inline-block">
            </v-img>
            <v-icon @click="refreshCaptcha"> adaico-refresh-2 </v-icon>
          </template>
        </v-text-field>
        <div v-if="captcharef && !captcharef.valid" class="pt-2 error--text">
          <div
            v-for="item in captcharef.validations"
            :key="item"
            style="font-size: 10px"
          >
            <v-icon color="error" size="17"> mdi-alert-circle-outline</v-icon>
            <span style="display: inline-block">
              {{ $t(item) }}
            </span>
          </div>
        </div>
      </div>
      <v-radio-group
        v-model="data.passwordType"
        class="ma-0 pa-0"
        hide-details
        row
      >
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
      <v-text-field
        v-if="data.passwordType == 2"
        class="otp mt-4"
        hide-details
        hide-spin-buttons
        outlined
        dense
      >
        <template #append>
          <v-btn
            class="primary"
            color="primary"
            width="100"
            :disabled="counter > 0"
            @click="requestOtp"
            :height="inputHeight - 8"
            depressed
            large
          >
            <span v-if="counter == 0">
              {{ $t("login.send-sms") }}
            </span>
            <span v-else>
              <v-icon size="17"> mdi-clock </v-icon>
              {{ formatter.format(Math.floor(counter / 60)) }}:{{
                formatter.format(counter % 60)
              }}
            </span>
          </v-btn>
        </template>
      </v-text-field>
      <!-- <client-only>
        <vue-hcaptcha
          v-if="failedCount > 3"
          sitekey="41a134fc-7604-4ee1-a5df-40c97195491a"
          language="fa"
          @verify="captchaResult"
        ></vue-hcaptcha>
      </client-only> -->
      <v-btn
        class="my-4"
        depressed
        color="primary"
        @click="login(data)"
        width="100%"
        :height="inputHeight"
        x-large
      >
        {{ $t("login.login") }}
      </v-btn>
    </v-form>
    <v-btn
      class="mb-6"
      depressed
      color="primary"
      to="/registration"
      width="100%"
      :height="inputHeight"
      outlined
      x-large
    >
      {{ $t("login.registration") }}
    </v-btn>

    <div class="text-justify" v-html="$t('login.alerts')"></div>
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
import { required } from "@/utils/rules";

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

    const frm: Ref<any> = ref(null);
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
      process.env.VUE_APP_Host +
      "sso/captcha?width=100&height=" +
      ((props.inputHeight ?? 42) - 8) +
      "&r=";
    const captchaUrl = ref(captcha);

    const failedCount = computed(() => store.getters["sso/user/tryCount"]);
    const rtl = computed(() => store.getters["rtl"]);

    //OTP
    const counter = ref(0);
    let timer: NodeJS.Timeout | null = null;

    async function login(data: Login) {
      if (frm.value?.validate()) {
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
          refreshCaptcha();
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

    function requestOtp() {
      counter.value = 90;
      timer = setInterval(() => {
        if (counter.value > 1) counter.value = counter.value - 1;
        else {
          if (timer) clearInterval(timer);
          counter.value = 0;
        }
      }, 1000);
    }

    onMounted(() => {
      userref.value?.focus();
    });

    return {
      console,
      frm,
      login,
      snack,
      captchaResult,
      checkTries,
      refreshCaptcha,
      requestOtp,
      counter,
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
      rules: {
        required,
      },
    };
    //TODO Remove in vue3
    function useI18n() {
      return context.root.$i18n;
    }
  },
});
</script>

<style lang="sass">
.otp
  &.v-text-field
    .v-input
      &__append-inner
        margin-top: 0 !important
      &__slot
        padding: 4px 12px 4px 4px !important
a
  text-decoration: none
.captcha
  .v-input__append-inner
    margin-top: 3px !important
.radio-ckeck
  border-radius: 5px
  width: calc( 50% - 8px )
  background-color: rgba(130, 130, 130, 0.1)
  font-weight: bold
  display: inline-block !important
  justify-content: center
  text-align: center
  &.v-item--active
    font-size: 1.1667rem
    background-color: rgba(53, 84, 209, 0.05)
    label
      width: auto
      color: var(--v-primary-base)
  .v-input--selection-controls__input
    width: auto
    .v-icon
      font-size: inherit

.pass-star.v-input.v-text-field
  input
    color: var(--v-default-lighten3)
    vertical-align: middle
    padding-bottom: 16px
    font-size: 36px
    line-height: 36px
</style>

<style lang="sass" scoped>
.mar-t-6
  margin-top: 6px
.mar-b-6
  margin-bottom: 6px
.pad-t-6
  padding-top: 6px
.pad-b-6
  padding-bottom: 6px
.pad-t-24
  padding-top: 24px
.pad-b-24
  padding-bottom: 24px
.primary
  &.v-btn
    &--disabled
      color: var(--v-primary-base) !important
      .v-icon
        color: var(--v-primary-base) !important
</style>
