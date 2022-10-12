<script lang="ts" setup>
import { Ref } from "vue";
import { AxiosError } from "axios";
import { LoginModel, PasswordType } from "@/types";
import { ErrorExtractor } from "~/utils/error";
import { useVirtualKeyBoard } from "@/utils/virtualKeyBoard";
import { useUser } from "@/composables";
import { useI18n } from "vue-i18n";
import { useForm, useField } from "vee-validate";
import { object, string, number, mixed, lazy } from "yup";
import { required } from "~~/utils/rules";

const appManager = useAsrTrader();
const locale = appManager.locale;
const userManager = useUser();
const router = useRouter();
const keyboard = ref(useVirtualKeyBoard());
const snack = useSnacks();
const i18n = useI18n();

const frm: Ref<any> = ref(null);
const userref: Ref<any> = ref(null);
const passref: Ref<any> = ref(null);
const captcharef: Ref<any> = ref(null);
const otpref: Ref<any> = ref(null);

const loading: Ref<boolean> = ref(false);
const showPassword: Ref<boolean> = ref(false);

const messageContent = await queryContent(
  `${useAsrTrader().locale.split("-")[0]}/login/message`
).find();

//TODO create interface
const loginSchema = object({
  userName: string().required(
    i18n.t("error.validation.required", { name: i18n.t("user.username") })
  ),
  password: lazy(() =>
    passwordType.value === PasswordType.static
      ? string().required(
          i18n.t("error.validation.required", { name: i18n.t("user.password") })
        )
      : string()
  ),
  otpModel: lazy(() =>
    passwordType.value === PasswordType.smsOtp
      ? string().required(
          i18n.t("error.validation.required", { name: i18n.t("login.otp") })
        )
      : string()
  ),
  captcha: string()
    .typeError(
      i18n.t("error.validation.number", { name: i18n.t("login.captcha") })
    )
    .required(
      i18n.t("error.validation.required", { name: i18n.t("login.captcha") })
    ),
  passwordType: number().required(),
});

const {
  errors,
  setValues,
  resetForm,
  validate,
  setFieldError,
  validateField,
  setErrors,
} = useForm({
  validationSchema: loginSchema,
  initialValues: {
    userName: "",
    password: "",
    passwordType: PasswordType.static,
    captcha: "",
    otpModel: "",
  },
});

// const { value:userName, meta:metaUserName, handleBlur, validate } = useField<string>('userName', null, { validateOnValueUpdate: false })
const { value: userName, meta: metaUserName } = useField<string>("userName");
const { value: password, meta: metaPassword } = useField<string>("password");

const { value: otpModel, meta: metaOtp } = useField<string>("otpModel");

const { value: passwordType } = useField<PasswordType>("passwordType");
const {
  value: captcha,
  meta: metaCaptcha,
  resetField: resetCaptchaField,
} = useField<string>("captcha");

// const snacs = reactive([]);
// const failedCount = userManager.tryCount;
const rtl = appManager.rtl;

const login = async () => {
  const { valid } = await validate()
  if (valid) {
    loading.value = true;
    try {
      const values = {
        userName: userName.value,
        password: password.value,
        passwordType: passwordType.value,
        captcha: captcha.value,
      };
      const res = await userManager.login(values);
      if (res >= 200 && res < 300) {
        const user = userManager.me;
        router.push(user.settings?.home ?? "/watchlist/wealth");
        snack.showMessage({
          content: "login.successful",
          color: "white",
          timeout: 3000,
          bg: "success",
        });
        resetForm({
          values: {
            userName: "",
            password: "",
            captcha: "",
            passwordType: PasswordType.static,
            otpModel: "",
          },
        });
      }
    } catch (err: any) {
      captcharef.value.refreshCaptcha();
      const error = ErrorExtractor(err as AxiosError);
      // actions.setFieldValue("captcha", '')

      if (error.detail.length == 0)
        snack.showMessage({
          content: "errors." + error.code,
          color: "error",
          timeout: 2000,
          bg: "error",
        });
      else {
        let res = "";
        for (let e in error.detail) {
          res += i18n.t(error.detail[e].type) + "\r\n";
        }
        resetCaptchaField();
        if (error.detail[0].loc == "user") {
          setFieldError("userName", "username invalid");
          setFieldError("password", "password invalid");
        } else if (error.detail[0].loc == "captcha") {
          setFieldError("captcha", "captcha invalid");
        }

        snack.showMessage({
          content: res,
          color: "error",
          timeout: 1500,
          bg: "error",
        });
      }
    } finally {
      loading.value = false;
    }
  }
};

function requestOtp() {
  otpref.value.focus();
  otpref.value.setTimer();
}

onMounted(() => {
  userref.value?.$el.children[1].children[1].focus();
});

function setFocus(el: string | null = null) {
  if (!el) {
    if (passref) passref.value?.$el.children[1].children[1].focus();
    else if (captcharef)
      captcharef.value?.$el.children[0].children[1].children[0].focus();
  } else {
    captcharef.value?.$el.children[0].children[1].children[0].focus();
  }
}
</script>
<style lang="postcss">
.pie-1 {
  left: calc(50% - 296px);
  top: -296px;
}

#login-page {
  @apply tw-h-full;
  .login-page {
    @apply tw-flex tw-h-full;

    .login-cmp {
      @apply tw-overflow-y-auto tw-w-full tw-h-full md:tw-w-1/2 tw-flex tw-items-center tw-bg-white;

      padding-bottom: 32px;
      position: relative;
      color: black;

      .login-input {
        .scaffold {
          @apply tw-h-[38px] tw-px-1;
        }
        &.inValid .scaffold {
          @apply tw-border-error tw-shadow-[0_0_3px_0] tw-shadow-error;
        }
        &.valid .scaffold {
          @apply tw-border-success tw-shadow-[0_0_3px_0] tw-shadow-success;
        }
      }

      form {
        margin-left: auto;
        margin-right: auto;
        max-width: 322px;

        .messageContent {
          @apply tw-text-justify tw-mt-6 tw-text-gray3;
        }
      }

      .legend {
        @apply tw-text-xl tw-mb-[9px] tw-p-0 tw-justify-start tw-font-bold;
      }
    }

    & > div {
      @apply tw-hidden md:tw-block tw-w-1/2;

      #toggle-slider {
        @apply tw-flex;

        button {
          @apply tw-mx-3;
        }
      }
    }

    #login-slider {
      @apply tw-items-center tw-justify-center tw-w-1/2 tw-hidden md:tw-flex;

      & > div {
        @apply tw-w-4/5 tw-h-5/6;

        & > .tabs {
          height: calc(100% - 48px);

          .tab .doc {
            @apply tw-w-full tw-text-white;

            h2 {
              text-align: center;
            }

            p {
              @apply tw-text-lg tw-text-justify;
            }
          }
        }

        & > .toggle {
          @apply tw-h-[48px] tw-justify-center;

          .ada-button {
            @apply tw-bg-transparent tw-mx-1;

            &.active::after {
              @apply tw-bg-transparent;
            }

            .item {
              transition: all 0.2s ease-in-out;

              @apply tw-h-3 tw-w-3 tw-inline-block tw-bg-white tw-rounded-sm;

              &.active {
                @apply tw-w-6;
              }
            }
          }
        }
      }
    }

    #banner {
      @apply tw-fixed tw-left-0 tw-h-full tw-w-20 tw-flex tw-flex-col tw-items-start tw-justify-center;

      button {
        @apply tw-w-[48px] tw-h-[48px] tw-bg-white tw-bg-opacity-10 tw-text-white tw-rounded-full tw-my-1;
      }
    }
  }
}
</style>

<template>
  <div id="login-page">
    <div class="pie-1 pie"></div>
    <div class="login-page">
      <fieldset class="login-cmp">
        <form ref="frm" @submit.prevent="login">
          <div class="logo"></div>
          <legend class="legend" v-text="$t('login.title')"></legend>
          <ada-input
            v-model="userName"
            tabIndex="1"
            ref="userref"
            name="username"
            :label="$t('user.username')"
            class="login-input"
            :class="{
              inValid: errors?.userName,
              valid: metaUserName?.valid && !errors?.userName,
            }"
            @keyup.enter="setFocus()"
            @focus="
              () => {
                if (keyboard.active)
                  keyboard.setListener((key) => {
                    setValues({ userName: userName + key });
                  });
              }
            "
          >
            <template #prepend="{ active }">
              <ada-icon :size="21" :color="active ? 'primary' : 'black'"
                >isax-user</ada-icon
              >
            </template>
            <template #append>
              <ada-icon
                class="tw-cursor-pointer"
                :size="24"
                @click="
                  () => {
                    keyboard.active = !keyboard.active;
                    if (keyboard.active)
                      keyboard.setListener((key) => {
                        setValues({ userName: userName + key });
                      });
                  }
                "
                :class="keyboard.active ? 'tw-text-primary' : null"
              >
                isax-keyboard
              </ada-icon>
            </template>
          </ada-input>
          <div
            v-text="errors?.userName"
            class="tw-text-error tw-h-[24px]"
          ></div>
          <otp
            v-if="passwordType == 2"
            @update:modelValue="val => otpModel = val"
            :modelValue="otpModel"
            timer="90"
            tabindex="2"
            class="login-input"
            :class="{
              inValid: errors?.otpModel,
              valid: metaOtp?.valid && !errors?.otpModel && otpModel.length,
            }"
            ref="otpref"
            @request="requestOtp"
            @keyup.enter="login"
          />
          <div
            v-if="passwordType == 2"
            v-text="errors?.otpModel"
            class="tw-text-error tw-h-[24px]"
          ></div>
          <ada-input
            v-if="passwordType == 1"
            v-model="password"
            name="password"
            tabIndex="2"
            ref="passref"
            :label="$t('user.password')"
            class="tw-block login-input"
            :class="{
              'pass-star': !showPassword,
              inValid: errors?.password,
              valid: metaPassword?.valid && !errors?.password,
            }"
            :type="showPassword ? 'text' : 'password'"
            @keyup.enter="
              () => {
                if (false) login;
                else setFocus('captch');
              }
            "
            @focus="
              () => {
                if (keyboard.active)
                  keyboard.setListener((key) => {
                    setValues({
                      password: password + key,
                    });
                  });
              }
            "
          >
            <template #prepend="{ active }">
              <ada-icon :size="21" :color="active ? 'primary' : 'black'"
                >isax-lock</ada-icon
              >
            </template>
            <template #append>
              <ada-icon
                :size="24"
                class="tw-mx-1 tw-cursor-pointer"
                :color="showPassword ? 'primary' : null"
                @click="showPassword = !showPassword"
              >
                isax-eye
              </ada-icon>
              <ada-icon
                class="tw-cursor-pointer"
                :size="24"
                :class="keyboard.active ? 'tw-text-primary' : null"
                @click="
                  () => {
                    keyboard.active = !keyboard.active;
                    if (keyboard.active)
                      keyboard.setListener((key) => {
                        setValues({
                          password: password + key,
                        });
                      });
                  }
                "
              >
                isax-keyboard
              </ada-icon>
            </template>
          </ada-input>
          <div
            v-if="passwordType == 1"
            v-text="errors?.password"
            class="tw-text-error tw-h-[24px]"
          ></div>
          <div class="tw-h-2" :style="{ 'text-align': rtl ? 'left' : 'right' }">
            <nuxt-link to="/reset-password" class="tw-text-primary">
              {{ $t("login.forget-password") }}
            </nuxt-link>
          </div>
          <div class="tw-m-0 tw-mt-[4px] tw-p-0" style="font-size: 10px"></div>
          <div v-if="true" class="tw-m-0 tw-p-0 tw-mt-1 tw-mb-4">
            <simple-captcha
              v-model="captcha"
              tabIndex="3"
              ref="captcharef"
              class="captcha login-input"
              :class="{
                inValid: errors?.captcha,
                valid: metaCaptcha?.valid && !errors?.captcha,
              }"
              @keyup.enter="
                () => {
                  if (passref) login;
                  else if (otpref) {
                    requestOtp();
                    otpref.focus();
                  }
                }
              "
              @focus="keyboard.active = false"
              outlined
              dense
            />
            <div
              class="tw-block tw-text-error tw-h-[24px]"
              v-text="errors?.captcha"
            ></div>
          </div>
          <ada-toggle v-model="passwordType" class="tw-m-0 tw-p-0">
            <ada-radio-button
              :items="[
                { value: 1, label: 'login.static' },
                { value: 2, label: 'login.otp' },
              ]"
              :size="24"
              class="tw-flex tw-font-bold"
            >
            </ada-radio-button>
          </ada-toggle>
          <ada-btn
            type="submit"
            tabindex="6"
            class="tw-h-[42px] tw-w-full tw-my-[16px] tw-bg-primary tw-text-white ripple"
          >
            {{ $t("login.login") }}
          </ada-btn>
          <ada-btn
            tabindex="7"
            to="/registration"
            class="tw-h-[42px] tw-w-full tw-bg-white tw-border tw-border-primary"
          >
            {{ $t("login.registration") }}
          </ada-btn>
          <ContentDoc :path="messageContent[0]._path" class="messageContent" />
        </form>
      </fieldset>
      <ada-content-slider path="/login-slider" id="login-slider">
      </ada-content-slider>
      <div id="banner">
        <ada-btn>
          <ada-icon :size="24">isax-instagram</ada-icon>
        </ada-btn>
        <ada-btn>
          <ada-icon :size="24">isax-whatsapp</ada-icon>
        </ada-btn>
        <ada-btn>
          <ada-icon :size="24">isax-facebook</ada-icon>
        </ada-btn>
        <ada-btn>
          <ada-icon :size="24">mdi-dots-horizontal</ada-icon>
        </ada-btn>
      </div>
      <virtual-keyboard />
    </div>
  </div>
</template>
