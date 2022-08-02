<script lang="ts">
export default {
  layout: "public",
};
</script>
<script setup lang="ts">
import { ref, Ref } from "#app";
import simpleCaptcha from "~/components/simpleCaptcha.vue";
import { useRouter } from "#app";
import { useAsrTrader } from "~~/composables/useAsrTrader";

const otpref: Ref<any> = ref(null);

const step = ref(1);
const forms: Ref<any> = ref({
  form1: null,
  form2: null,
  form0: null,
});
const rform1: Ref<any> = ref(null),
  rform2: Ref<any> = ref(null),
  rform0: Ref<any> = ref(null);
const appManager = useAsrTrader();
const rtl = appManager.rtl



function back() {
  if (step.value == 1) {
    useRouter().replace("/login");
  } else step.value = (step.value - 1) % 3;
}

function validate() {
  switch (step.value) {
    case 1:
      if (rform0.value.validate()) step.value = 2;
      break;
    case 2:
      if (rform1.value.validate()) step.value = 3;
      break;
    case 3:
      rform2.value.validate();
      break;
    default:
      break;
  }
}
function requestOtp() {
  otpref.value.setTimer();
}
</script>

<template>
  <div class="reg-ct">
    <div class="pie-1 pie"></div>
    <div class="pie-2 pie"></div>

    <v-card class="dotted reg-crd">
      <ada-icon color="gray" :size="24"
        :class="['tw-absolute tw-top-20', !rtl ? 'tw-left-10 tw-rotate-180' : 'tw-left-auto tw-right-10']"
        @click="back"> mdi-arrow-right </ada-icon>
      <div class="justify-center text-center">
        <nuxt-link tabindex="-1" to="/about-us" class="logo" />
        <h3>
          {{ $t("login.registration") }}
        </h3>
      </div>
      <v-stepper v-model="step" class="ma-0 pa-0 step" flat alt-labels>
        <v-stepper-header>
          <v-stepper-step step="1" :complete="step > 1" :rules="[() => forms.form0 == null || forms.form0]"
            class="justify-start">
            {{ $t("user.profile.id") }}
          </v-stepper-step>
          <v-divider :color="step > 1 ? 'primary' : 'default'" />
          <v-stepper-step step="2" :complete="step > 2" :rules="[() => forms.form1 == null || forms.form1]">
            {{ $t("user.profile.confirm") }}
          </v-stepper-step>
          <v-divider :color="step > 2 ? 'primary' : 'default'" />
          <v-stepper-step step="3" :complete="step > 3" :rules="[() => forms.form2 == null || forms.form2]"
            class="justify-end">
            {{ $t("user.profile.sajam") }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content class="ma-0 my-2 pa-0" step="1">
            <v-form v-model="forms.form0" ref="rform0" lazy-validation>
              <text-input tabIndex="1" :label="$t('user.profile.nid')" class="tw-block" borderColor="tw-border-gray-200"
                bg="white" maxWidth="100%">
                <template #prepend="{ active }">
                  <ada-icon :size="21" :color="[active ? 'primary' : 'black']">isax-user</ada-icon>
                </template>
              </text-input>
              <text-input tabIndex="1" :label="$t('user.profile.contact.mobile')" class="tw-block" borderColor="tw-border-gray-200"
                bg="white" maxWidth="100%">
                <template #prepend="{ active }">
                  <ada-icon :size="21" :color="[active ? 'primary' : 'black']">isax-mobile</ada-icon>
                </template>
              </text-input>
            </v-form>
          </v-stepper-content>
          <v-stepper-content class="ma-0 my-2 pa-0" step="2">
            <v-form v-model="forms.form1" ref="rform1" lazy-validation>
              <div>
                <h4 class="my-1">{{ $t("login.captcha") }}</h4>
                <simple-captcha tabIndex="1" :height="42" outlined dense />
              </div>
              <div>
                <h4>
                  {{ $t("login.otp") }}
                </h4>
                <otp ref="otpref" timer="90" :height="42" tabindex="2" @request="requestOtp" @keyup.enter="validate"
                  outlined dense />
              </div>
            </v-form>
          </v-stepper-content>
          <v-stepper-content class="ma-0 my-2 pa-0" step="3">
            <v-form v-model="forms.form2" ref="rform2" lazy-validation>
              <v-card>
                <v-row>
                  <v-col cols="6"> نام: حسین </v-col>
                  <v-col cols="6"> نام خانوادگی: لطفی سیلاب </v-col>
                  <v-col cols="6"> نام پدر: حسن </v-col>
                  <v-col cols="6"> جنسیت: مرد </v-col>
                  <v-col cols="6"> ش ش: 1690184078 </v-col>
                  <v-col cols="6"> س ش: 17 د 737674 </v-col>
                  <v-col cols="6"> محل صدور: آذرشهر </v-col>
                  <v-col cols="6"> محل تولد: آذرشهر </v-col>
                  <v-col cols="6"> تاریخ تولد: 1377/08/20 </v-col>
                </v-row>
                <v-checkbox :ripple="false" :label="$t('general.confirm-information')" color="success">
                </v-checkbox>
              </v-card>
            </v-form>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
      <ada-btn color="primary" @click="validate" class="next" :height="42" large dark>
        {{ $t("general.next") }}
      </ada-btn>
      <div v-html="$t('login.alerts')" class="mt-3 text-justify"></div>
    </v-card>
  </div>
</template>

<style lang="postcss">
.reg-crd {
  .ada-input {
    @apply tw-mt-4;

    .label {
      @apply tw-my-2;
    }

    .scaffold {
      @apply tw-border tw-border-gray-700 tw-px-3 tw-h-16;

      &.active {
        @apply tw-border-primary;
      }
    }
  }
}
</style>

<style lang="postcss" scoped>
.next {
  width: 100%;
}

.back {
  position: absolute;
  top: 72px;
  left: 39px;
  transform: rotate(180deg);
}

.v-application--is-rtl {
  .back {
    transform: rotate(0);
    right: 39px;
    left: auto;
  }
}

.v-stepper {
  &__header {
    box-shadow: none;
  }

  &__step {
    padding: 20px 0;
    flex-basis: auto !important;
  }

  .v-divider {
    max-width: 32%;
  }
}

.reg-ct {
  position: relative;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 calc(50% - 257px) !important;
}

.reg-crd {
  border-radius: 24px;
  padding: 41px 96px;
  max-width: 514px;
  min-width: 514px;
  height: 658px;
}

.pie-1 {
  top: -290px;
  right: -100px;
}

.pie-2 {
  bottom: -290px;
  left: -210px;
}
</style>
