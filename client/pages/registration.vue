<template>
  <v-container class="ma-0 pa-0 pt-16 reg-ct" fluid>
    <div class="pie-1 pie">
      <div class="pie-inner"></div>
    </div>
    <div class="pie-2 pie">
      <div class="pie-inner"></div>
    </div>
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
              <v-divider></v-divider>
              <v-stepper-step
                step="2"
                :complete="step > 2"
                :rules="[() => forms.form1 == null || forms.form1]"
              >
                {{ $t("user.profile.confirm") }}
              </v-stepper-step>
              <v-divider></v-divider>
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
              <v-stepper-content class="ma-0 pa-0" step="1">
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
              <v-stepper-content step="2">
                <v-form v-model="forms.form1" ref="forms.rform1">
                  <v-text-field :label="$t('login.otp')"> </v-text-field>

                  <v-btn color="primary">
                    {{ $t("login.send-sms") }}
                  </v-btn>
                </v-form>
              </v-stepper-content>
              <v-stepper-content step="3">
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
          <div
            v-html="$t('login.alerts')"
            class="mt-3 text-center font-12"
          ></div>
        </v-card>
      </v-col>
      <v-col></v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, useContext } from "@nuxtjs/composition-api";

export default defineComponent({
  layout: "public",
  setup(props) {
    const ctx = useContext();
    const progress = ref(0);
    const step = ref(1);
    const forms: Ref<any> = ref({
      form1: null,
      form2: null,
      form0: null,
      rform1: null,
      rform2: null,
      rform0: null,
    });

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
    return {
      forms,
      back,
      validate,
      captchaResult,
      step,
      progress,
    };
  },
});
</script>

<style lang="sass" scoped>
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