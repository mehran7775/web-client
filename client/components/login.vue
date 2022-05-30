<script setup lang="ts">
import { ref, Ref, reactive, onMounted, useNuxtApp } from "#app";
import { AxiosError } from "axios";
import { LoginModel, PasswordType } from "@/types";
import { ErrorExtractor } from "~/utils/error";
import { required } from "@/utils/rules";
import { useVirtualKeyBoard } from "@/utils/virtualKeyBoard";
import { useAsrTrader, useUser, useSnacks } from "@/composables";
import { useRouter } from "#app";

const props = withDefaults(
  defineProps<{
    width: number;
    inputHeight: number;
  }>(),
  {
    inputHeight: 32,
    width: 288,
  }
);

const appManager = useAsrTrader();
const userManager = useUser();
const router = useRouter();
const keyboard = ref(useVirtualKeyBoard());
const snack = useSnacks();
const { $i18n: i18n } = useNuxtApp();

const frm: Ref<any> = ref(null);
const userref: Ref<any> = ref(null);
const passref: Ref<any> = ref(null);
const captcharef: Ref<any> = ref(null);
const otpref: Ref<any> = ref(null);
const checkTries = userManager.checkTries;
const rules = {
  required,
};

const loading: Ref<boolean> = ref(false);
const showPassword: Ref<boolean> = ref(false);
const data: Ref<LoginModel> = ref({
  userName: "",
  password: "",
  passwordType: PasswordType.static,
  captcha: "",
});
const snacs = reactive([]);

const failedCount = userManager.tryCount;
const rtl = appManager.rtl;

async function login(data: LoginModel) {
  if (frm.value?.validate()) {
    loading.value = true;
    try {
      const res = await userManager.login(data);
      if (res >= 200 && res < 300) {
        const user = userManager.me;
        router.push(user.settings?.home ?? "/watchlist/wealth");
        snack.showMessage({ content: "login.successful", color: "success" });
      }
    } catch (err) {
      captcharef.value.refreshCaptcha();
      const error = ErrorExtractor(err as AxiosError);
      if (error.detail.length == 0)
        snack.showMessage({ content: "errors." + error.code, color: "error" });
      else {
        let res = "";
        for (let e in error.detail) {
          res += i18n.t(error.detail[e].type) + "\r\n";
        }
        snack.showMessage({ content: res, color: "error" });
      }
    } finally {
      loading.value = false;
    }
  }
}
function captchaResult(code: string) {
  data.value.captcha = code;
}

function requestOtp() {
  frm.value.validate();
  otpref.value.focus();
  if (userref.value.validate() && captcharef.value.validate()) {
    otpref.value.setTimer();
  }
}

onMounted(() => {
  userref.value?.focus();
});
</script>

<style lang="postcss">
fieldset.login-cmp {
  position: relative;
  color: black;

  >.legend {
    @apply tw-text-xl tw-m-0 tw-mt-[8px] tw-p-0 tw-justify-start tw-font-bold;
    display: block;
  }
  >button {
    color: var(--c-primary-rgb);
  }
}

a {
  text-decoration: none;
}

button {
  color: var(--c-primary-rgb);
}

.radio-check {
  border-radius: 5px;
  width: calc(50% - 8px);
  background-color: rgba(130, 130, 130, 0.1);
  font-weight: bold;
  display: inline-block !important;
  justify-content: center;
  text-align: center;

  &.v-item--active {
    font-size: 1.1667rem;
    background-color: rgba(var(--c-primary), 0.05);

    label {
      width: auto;
      color: var(--c-primary-rgb);
    }
  }

  .v-input--selection-controls__input {
    width: auto;

    .icon {
      font-size: inherit;
    }
  }
}

.pass-star.v-input.v-text-field {
  input {
    color: var(--v-default-lighten3);
    vertical-align: middle;
    padding-bottom: 16px;
    font-size: 36px;
    line-height: 36px;
  }
}
</style>

<template>
  <fieldset class="login-cmp tw-m-0 tw-p-0" :max-width="width" :min-width="width" elevation="0" color="transparent"
    :loading="loading">
    <div class="legend">{{
        $t("login.title")
    }}</div>
    <v-form ref="frm">
      <p class="tw-mt-[16px] tw-mb-2">{{ $t("user.username") }}</p>
      <v-text-field aria-label="username" aria-required="true" tabindex="1" ref="userref" :height="inputHeight"
        v-model="data.userName" prepend-inner-icon="isax-user" :rules="[rules.required]" @input="checkTries"
        @keyup.enter="
          () => {
            if (passref) passref.focus();
            else if (captcharef) captcharef.focus();
          }
        " @focus="
  () => {
    if (keyboard.active)
      keyboard.setListener((key) => {
        data.userName = data.userName + key;
      });
  }
" hide-details outlined dense validate-on-blur>
        <template #append>
          <ada-icon :size="24" @click="
            () => {
              keyboard.active = !keyboard.active;
              if (keyboard.active)
                keyboard.setListener((key) => {
                  data.userName = data.userName + key;
                });
            }
          " :color="keyboard.active ? 'primary' : null">
            isax-keyboard
          </ada-icon>
        </template>
      </v-text-field>
      <div v-if="userref && !userref.valid" class="error--text" style="font-size: 10px">
        <div v-for="item in userref.validations" :key="item" class="pt-2">
          <ada-icon color="error" :size="17"> mdi-alert-circle-outline</ada-icon>
          <span style="display: inline-block">
            {{ $t(item) }}
          </span>
        </div>
      </div>
      <p v-if="data.passwordType == 2" class="tw-mt-4 tw-mb-2">
        {{ $t("login.otp") }}
      </p>
      <p v-else class="tw-mt-4 tw-mb-2">{{ $t("user.password") }}</p>
      <otp v-if="data.passwordType == 2" timer="90" :height="inputHeight" tabindex="4" ref="otpref"
        @request="requestOtp" @keyup.enter="
          () => {
            login(data);
          }
        " outlined dense />
      <v-text-field aria-label="password" aria-required="true" v-if="data.passwordType == 1" tabindex="2" ref="passref"
        :height="inputHeight" v-model="data.password" :type="showPassword ? 'text' : 'Password'"
        prepend-inner-icon="isax-lock" @keyup.enter="
          () => {
            if (false) login(data);
            else captcharef.focus();
          }
        " @focus="
  () => {
    if (keyboard.active)
      keyboard.setListener((key) => {
        data.password = data.password + key;
      });
  }
" :class="{ 'pass-star': !showPassword }" :rules="[rules.required]" hide-details outlined dense validate-on-blur>
        <template #append>
          <ada-icon :size="24" class="tw-mx-1" :color="showPassword ? 'primary' : null"
            @click="showPassword = !showPassword">
            isax-eye
          </ada-icon>
          <ada-icon :size="24" @click="
            () => {
              keyboard.active = !keyboard.active;
              if (keyboard.active)
                keyboard.setListener((key) => {
                  data.password = data.password + key;
                });
            }
          ">
            isax-keyboard
          </ada-icon>
        </template>
      </v-text-field>
      <v-row class="tw-m-0 tw-mt-[4px] tw-p-0" style="font-size: 10px">
        <v-col cols="6" class="tw-m-0 tw-p-0">
          <div v-if="passref" class="error--text">
            <div v-for="item in passref.validations" :key="item" class="tw-mb-1">
              <ada-icon color="error" :size="17"> mdi-alert-circle-outline</ada-icon>
              <span style="display: inline-block">
                {{ $t(item) }}
              </span>
            </div>
          </div>
        </v-col>
        <v-col cols="6" class="tw-m-0 tw-p-0 tw-justify-end" :style="{
          'text-align': rtl ? 'left' : 'right',
        }">
          <nuxt-link to="/reset-password">
            {{ $t("login.forget-password") }}
          </nuxt-link>
        </v-col>
      </v-row>
      <div v-if="true" class="tw-m-0 tw-p-0 tw-mt-1 tw-mb-4">
        <p class="tw-mb-2">{{ $t("login.captcha") }}</p>
        <simple-captcha v-model="data.captcha" tabindex="3" ref="captcharef" class="captcha" :height="inputHeight"
          @keyup.enter="
            () => {
              if (passref) login(data);
              else if (otpref) {
                requestOtp();
                otpref.focus();
              }
            }
          " @focus="
  () => {
    keyboard.active = false;
  }
" outlined dense />
      </div>
      <v-radio-group v-model="data.passwordType" class="tw-m-0 tw-p-0" hide-details row>
        <v-radio v-for="(item, index) in [
          { value: 1, text: $t('login.static') },
          { value: 2, text: $t('login.otp') },
        ]" tabindex="5" :ripple="false" :key="item.value" :label="item.text" :value="item.value"
          on-icon="mdi-check-circle" off-icon="mdi-check-circle-outline" :class="{
            'radio-check ma-0 pa-2': true,
            'me-4': index != 1, //last index
          }" style="width: calc(50% - 8px)" />
      </v-radio-group>
      <ada-btn tabindex="6" class="dark tw-my-[16px] tw-text-xl" depressed color="primary" @click="login(data)"
        width="100%" :height="inputHeight">
        {{ $t("login.login") }}
      </ada-btn>
    </v-form>
    <ada-btn tabindex="7" class="tw-mb-8 tw-text-xl" depressed color="primary" to="/registration" width="100%"
      :height="inputHeight" bordered>
      {{ $t("login.registration") }}
    </ada-btn>

    <div class="text-justify" v-html="$t('login.alerts')"></div>
  </fieldset>
</template>
