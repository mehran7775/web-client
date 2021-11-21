<template>
  <v-container class="login ma-0 pa-0 pt-5" fluid>
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
        <v-card>
          <v-card-title class="text-center justify-center">
            {{ $t("login.registration") }}
          </v-card-title>
          <v-stepper v-model="step">
            <v-stepper-header>
              <v-stepper-step
                step="0"
                :complete="step > 0"
                :rules="[() => form0 == null || form0]"
              >
                {{ $t("profile.id") }}
              </v-stepper-step>
              <v-stepper-step
                step="1"
                :complete="step > 1"
                :rules="[() => form1 == null || form1]"
              >
                {{ $t("profile.confirm") }}
              </v-stepper-step>
              <v-stepper-step
                step="2"
                :complete="step > 2"
                :rules="[() => form2 == null || form2]"
              >
                {{ $t("profile.sajam") }}
              </v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content step="0">
                <v-form v-model="form0" ref="forms.rform0">
                  <v-container fluid>
                    <v-row>
                      <v-col>
                        <v-text-field :label="$t('profile.nid')">
                        </v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field :label="$t('profile.contact.phone')">
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-stepper-content>
              <v-stepper-content step="1">
                <v-form v-model="form1" ref="forms.rform1">
                  <v-container fluid>
                    <v-row>
                      <v-col>
                        <v-text-field :label="$t('profile.nid')">
                        </v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field :label="$t('profile.contact.phone')">
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-stepper-content>
              <v-stepper-content step="2">
                <v-form v-model="form2" ref="forms.rform2">
                  <v-container fluid>
                    <v-row>
                      <v-col>
                        <v-text-field :label="$t('profile.nid')">
                        </v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field :label="$t('profile.contact.phone')">
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="step = (step - 1) % 3">
              {{ $t("general.privios") }}
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
  setup(props) {
    const progress = ref(0);
    const step = ref(0);
    const form1 = ref(null);
    const form2 = ref(null);
    const form0 = ref(null);
    const forms: Ref<any> = ref({
      rform1: null,
      rform2: null,
      rform0: null,
    });

    function validate() {
      forms.value["rform" + step]?.validate();
      step.value = (step.value + 1) % 3;
    }
    return {
      form0,
      form1,
      form2,
      forms,
      validate,
      step,
      progress,
    };
  },
});
</script>
