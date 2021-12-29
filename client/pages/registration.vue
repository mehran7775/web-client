<template>
  <v-container class="ma-0 pa-0 pt-16 reg-ct" fluid>
    <div class="pie-1 pie"></div>
    <div class="pie-2 pie"></div>
    <v-row>
      <v-col></v-col>
      <v-col>
        <v-card class="dotted reg-crd">
          <div class="ma-0 pa-0 justify-center text-center">
            <v-icon size="24" class="back" @click="back">
              mdi-arrow-right
            </v-icon>
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
              <v-divider :color="step > 2 ? 'primary' : 'default'"/>
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
                <v-form v-model="forms.form0" ref="forms.rform0">
                  <h4>{{ $t("user.profile.nid") }}</h4>
                  <v-text-field
                    class="my-2"
                    prepend-inner-icon="mdi-account"
                    outlined
                    hide-details
                    dense
                  >
                  </v-text-field>
                  <h4>{{ $t("user.profile.contact.mobile") }}</h4>
                  <v-text-field
                    class="my-2"
                    prepend-inner-icon="mdi-cellphone"
                    outlined
                    hide-details
                    dense
                  >
                  </v-text-field>
                </v-form>
              </v-stepper-content>
              <v-stepper-content class="ma-0 my-2 pa-0" step="2">
                <v-form v-model="forms.form1" ref="forms.rform1">
                  <div v-if="true">
                    <h4 class="my-1">{{ $t("login.captcha") }}</h4>
                    <v-text-field
                      class="captcha"
                      @keyup.enter="() => {}"
                      hide-details
                      outlined
                      dense
                    >
                      <template #append>
                        <v-img
                          :src="captchaUrl"
                          class="ma-0 pa-0 d-inline-block"
                        >
                        </v-img>
                        <v-icon @click="refreshCaptcha"> mdi-refresh </v-icon>
                      </template>
                    </v-text-field>
                  </div>
                  <div>
                    <h4>
                      {{ $t("login.otp") }}
                    </h4>
                    <v-text-field class="otp" hide-details outlined dense>
                      <template #append>
                        <v-btn
                          class="primary"
                          color="primary"
                          width="100"
                          :disabled="counter > 0"
                          @click="requestOtp"
                          depressed
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
                  </div>
                </v-form>
              </v-stepper-content>
              <v-stepper-content class="ma-0 my-2 pa-0" step="3">
                <v-form v-model="forms.form2" ref="forms.rform2">
                  <v-card>
                    <v-card-text> اطلاعات سجام </v-card-text>
                    <v-card-actions>
                      <v-checkbox :label="$t('general.confirm-information')">
                      </v-checkbox>
                    </v-card-actions>
                  </v-card>
                </v-form>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
          <v-btn color="primary" @click="validate" class="next">
            {{ $t("general.next") }}
          </v-btn>
          <div v-html="$t('login.alerts')" class="mt-3 text-justify"></div>
        </v-card>
      </v-col>
      <v-col></v-col>
    </v-row>
  </v-container>
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

export default defineComponent({
  layout: "public",
  setup(props) {
    const store = useStore();
    const ctx = useContext();
    const progress = ref(0);
    const counter = ref(0);
    let timer: NodeJS.Timeout | null = null;
    const step = ref(1);
    const forms: Ref<any> = ref({
      form1: null,
      form2: null,
      form0: null,
      rform1: null,
      rform2: null,
      rform0: null,
    });
    const captcha =
      process.env.VUE_APP_Host + "sso/captcha?width=100&height=32&r=";
    const captchaUrl = ref(captcha);
    const formatter: ComputedRef<Intl.NumberFormat> = computed(
      () => store.getters["formatter"] as Intl.NumberFormat
    );
    const rtl = computed(() => store.getters["rtl"]);

    function captchaResult() {}

    function back() {
      if (step.value == 1) {
        ctx.redirect("/login");
      } else step.value = (step.value - 1) % 3;
    }

    function validate() {
      switch (step.value) {
        case 3:
          break;
        default:
          forms.value["rform" + step.value]?.validate();
          step.value = Math.abs((step.value % 3) + 1);
          break;
      }
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
    return {
      rtl,
      formatter,
      forms,
      captchaUrl,
      back,
      validate,
      captchaResult,
      refreshCaptcha,
      counter,
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
      color: var(--v-primary-base) !important
      .v-icon
        color: var(--v-primary-base) !important
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
    padding: 24px 0
    flex-basis: auto !important
  .v-divider
    max-width: 33%
.reg-ct
  position: relative
  height: 100%
  overflow: hidden
.reg-crd
  border-radius: 24px
  padding: 41px 96px
  max-width: 514px
  min-width: 514px
.pie-1
  top: -290px
  right: -100px
.pie-2
  bottom: -290px
  left: -210px
</style>