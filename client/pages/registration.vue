<template>
  <v-container class="ma-0 pa-0 pt-16" fluid>
    <div class="pie-1 pie">
      <div class="pie-inner"></div>
    </div>
    <div class="pie-2 pie">
      <div class="pie-inner"></div>
    </div>
    <v-row>
      <v-col></v-col>
      <v-col class="justify-center align-center text-center">
        <nuxt-link to="/about-us" class="logo" />
      </v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col cols="2"></v-col>
      <v-col cols="8">
        <v-card class="dotted">
          <v-card-title class="text-center justify-center">
            {{ $t("login.registration") }}
          </v-card-title>
          <v-stepper v-model="step">
            <v-stepper-header>
              <v-stepper-step
                step="0"
                :complete="step > 0"
                :rules="[() => forms.form0 == null || forms.form0]"
              >
                {{ $t("user.profile.id") }}
              </v-stepper-step>
              <v-stepper-step
                step="1"
                :complete="step > 1"
                :rules="[() => forms.form1 == null || forms.form1]"
              >
                {{ $t("user.profile.confirm") }}
              </v-stepper-step>
              <v-stepper-step
                step="2"
                :complete="step > 2"
                :rules="[() => forms.form2 == null || forms.form2]"
              >
                {{ $t("user.profile.sajam") }}
              </v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content step="0">
                <v-form v-model="forms.form0" ref="forms.rform0">
                  <v-container fluid>
                    <v-row>
                      <v-col cols="9">
                        <v-text-field :label="$t('user.profile.nid')">
                        </v-text-field>
                        <v-text-field
                          :label="$t('user.profile.contact.mobile')"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="3" class="justify-center text-center">
                        <!-- <client-only>
                          <vue-hcaptcha
                            sitekey="41a134fc-7604-4ee1-a5df-40c97195491a"
                            language="fa"
                            size="compact"
                            data-theme="dark"
                            @verify="captchaResult"
                          ></vue-hcaptcha>
                        </client-only> -->
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-stepper-content>
              <v-stepper-content step="1">
                <v-form v-model="forms.form1" ref="forms.rform1">
                  <v-container fluid>
                    <v-row>
                      <v-col cols="9" class="justify-center text-center">
                        <v-text-field :label="$t('login.otp')"> </v-text-field>
                      </v-col>
                      <v-col cols="3" class="justify-center text-center">
                        <!-- <client-only>
                          <vue-hcaptcha
                            sitekey="41a134fc-7604-4ee1-a5df-40c97195491a"
                            language="fa"
                            size="compact"
                            data-theme="dark"
                            @verify="captchaResult"
                          ></vue-hcaptcha>
                        </client-only> -->
                        <v-btn color="primary">
                          {{ $t("login.send-sms") }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-stepper-content>
              <v-stepper-content step="2">
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
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="step = (step - 1) % 3">
              {{ $t("general.previous") }}
            </v-btn>
            <v-btn color="primary" @click="validate">
              {{ $t("general.next") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "@nuxtjs/composition-api";

export default defineComponent({
  layout: "public",
  setup(props) {
    const progress = ref(0);
    const step = ref(0);
    const forms: Ref<any> = ref({
      form1: null,
      form2: null,
      form0: null,
      rform1: null,
      rform2: null,
      rform0: null,
    });

    function captchaResult() {}

    function validate() {
      switch (step.value) {
        default:
          forms.value["rform" + step.value]?.validate();
          step.value = (step.value + 1) % 3;
          break;
      }
    }
    return {
      forms,
      validate,
      captchaResult,
      step,
      progress,
    };
  },
});
</script>

<style lang="sass" scoped>
.pie-1
  top: -290px
  right: -100px
.pie-2
  bottom: -290px
  left: -100px
</style>