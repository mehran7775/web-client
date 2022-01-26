<template>
  <div class="ma-0 pa-0 reg-ct">
    <div class="pie-1 pie"></div>
    <div class="pie-2 pie"></div>

    <v-card class="dotted reg-crd">
      <div class="ma-0 pa-0 justify-center text-center">
        <v-icon size="24" class="back" @click="back"> mdi-arrow-right </v-icon>
        <nuxt-link to="/about-us" class="logo" />
        <h3>
          {{ $t("login.registration") }}
        </h3>
      </div>
      <v-stepper v-model="step" class="ma-0 pa-0 step" flat alt-labels>
        <v-stepper-header>
          <v-stepper-step
            step="1"
            :complete="step > 1"
            :rules="[() => forms.form0 == null || forms.form0]"
            class="justify-start"
          >
            {{ $t("user.profile.id") }}
          </v-stepper-step>
          <v-divider :color="step > 1 ? 'primary' : 'default'" />
          <v-stepper-step
            step="2"
            :complete="step > 2"
            :rules="[() => forms.form1 == null || forms.form1]"
          >
            {{ $t("user.profile.confirm") }}
          </v-stepper-step>
          <v-divider :color="step > 2 ? 'primary' : 'default'" />
          <v-stepper-step
            step="3"
            :complete="step > 3"
            :rules="[() => forms.form2 == null || forms.form2]"
            class="justify-end"
          >
            {{ $t("user.profile.sajam") }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content class="ma-0 my-2 pa-0" step="1">
            <v-form v-model="forms.form0" ref="rform0" lazy-validation>
              <h4>{{ $t("user.profile.nid") }}</h4>
              <v-text-field
                class="my-2"
                prepend-inner-icon="isax-user"
                outlined
                hide-details
                dense
              >
              </v-text-field>
              <h4>{{ $t("user.profile.contact.mobile") }}</h4>
              <v-text-field
                class="my-2"
                prepend-inner-icon="isax-mobile"
                outlined
                hide-details
                dense
              >
              </v-text-field>
            </v-form>
          </v-stepper-content>
          <v-stepper-content class="ma-0 my-2 pa-0" step="2">
            <v-form v-model="forms.form1" ref="rform1" lazy-validation>
              <div>
                <h4 class="my-1">{{ $t("login.captcha") }}</h4>
                <simple-captcha tabindex="1" :height="42" outlined dense />
              </div>
              <div>
                <h4>
                  {{ $t("login.otp") }}
                </h4>
                <otp
                  ref="otpref"
                  timer="90"
                  :height="42"
                  tabindex="2"
                  @request="requestOtp"
                  @keyup.enter="validate"
                  outlined
                  dense
                />
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
                <v-checkbox
                  :ripple="false"
                  :label="$t('general.confirm-information')"
                  color="success"
                >
                </v-checkbox>
              </v-card>
            </v-form>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
      <v-btn color="primary" @click="validate" class="next" height="42" large>
        {{ $t("general.next") }}
      </v-btn>
      <div v-html="$t('login.alerts')" class="mt-3 text-justify"></div>
    </v-card>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  computed,
  ComputedRef,
  useContext,
  useStore,
} from "@nuxtjs/composition-api";
import simpleCaptcha from "~/components/simpleCaptcha.vue";
import { useAsrTrader } from "~/composables";


export default defineComponent({
  components: { simpleCaptcha },
  layout: "public",
  setup(props) {
    const store = useStore();
    const appManager = useAsrTrader(store);
    const ctx = useContext();
    const progress = ref(0);
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

    const rtl = appManager.rtl;

    function back() {
      if (step.value == 1) {
        ctx.redirect("/login");
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
    return {
      rtl,
      forms,
      rform1,
      rform2,
      rform0,
      otpref,
      back,
      validate,
      requestOtp,
      step,
      progress,
    };
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
</style>

<style lang="sass" scoped>
.primary
  &.v-btn
    &--disabled
      color: $c-primary !important
      .v-icon
        color: $c-primary !important
.next
  width: 100%
.back
  position: absolute
  top: 72px
  left: 39px

.v-application--is-rtl
  .back
    right: 39px
.v-stepper
  &__header
    box-shadow: none
  &__step
    padding: 20px 0
    flex-basis: auto !important
  .v-divider
    max-width: 32%
.reg-ct
  position: relative
  height: 100%
  overflow: hidden
  display: flex
  flex-direction: column
  justify-content: center
  padding: 0 calc(50% - 257px) !important
.reg-crd
  border-radius: 24px
  padding: 41px 96px
  max-width: 514px
  min-width: 514px
  height: 658px
.pie-1
  top: -290px
  right: -100px
.pie-2
  bottom: -290px
  left: -210px
</style>