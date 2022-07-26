<script lang="ts">
export default {
  layout: "public",
};
</script>
<script setup lang="ts">
import { useVirtualKeyBoard } from "@/utils/virtualKeyBoard";
import { ref } from "#app";
import { useRouter } from "#app";
import { useAsrTrader } from "~~/composables/useAsrTrader";


const router = useRouter();
const userName = ref("");
const loading = ref(false);
const keyboard = ref(useVirtualKeyBoard());
const appManager = useAsrTrader();
const rtl = appManager.rtl
function otp() { }
function captchaResult() { }
function back() {
  router.push("/login");
}
</script>

<template>
  <div :class="['res-ct', rtl ? 'tw-text-right' : 'tw-text-left']">
    <div class="pie pie-1"></div>
    <div class="pie pie-2"></div>
    <v-card elevation="0" class="dotted res-crd" :loading="loading">
      <ada-icon color="gray" :size="24" :class="['tw-absolute tw-top-20', !rtl ? 'tw-left-10 tw-rotate-180' : 'tw-left-auto tw-right-10']" @click="back"> mdi-arrow-right </ada-icon>
      <div class="text-center">
        <nuxt-link to="/about-us" class="logo" />
        <h3>{{ $t("login.forget-password") }}</h3>
      </div>
      <v-card-text class="tw-px-3">
        <v-form>
          <!-- <p class="tw-mt-[16px] tw-mb-2 tw-text-base">{{ $t("user.username") }}</p> -->
          <!-- <text-input v-model:value="userName" :placeholder="$t('user.username')" :label="$t('user.username')"
            :focus="() =>{
                if (keyboard.active)
                  keyboard.setListener((key) => {
                    userName = userName + key;
                  });
              }"
          >
            <template #prepend>
              <ada-icon :size="24">isax-user</ada-icon>
            </template>
            <template #append>
               <ada-icon :size="24" @click="
                () => {
                  keyboard.active = !keyboard.active;
                  if (keyboard.active)
                    keyboard.setListener((key) => {
                      userName = userName + key;
                    });
                }
              " :color="keyboard.active ? 'primary' : null">
                isax-keyboard
              </ada-icon>
            </template>
          </text-input> -->
          <v-text-field v-model="userName" :placeholder="$t('user.username')" prepend-inner-icon="isax-user"
            class="my-2" outlined hide-details dense aria-lable="username" @focus="
              () => {
                if (keyboard.active)
                  keyboard.setListener((key) => {
                    userName = userName + key;
                  });
              }
            ">
            <template #append>
              <ada-icon :size="24" @click="
                () => {
                  keyboard.active = !keyboard.active;
                  if (keyboard.active)
                    keyboard.setListener((key) => {
                      userName = userName + key;
                    });
                }
              " :color="keyboard.active ? 'primary' : null">
                isax-keyboard
              </ada-icon>
            </template>
          </v-text-field>
          <label for="captcha" class="tw-block tw-mb-2 tw-text-base">{{ $t("login.captcha") }}</label>
          <simple-captcha tabindex="1" :height="42" outlined dense id="captcha"
            @focus="() => keyboard.active = false" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <ada-btn depressed color="primary" @click="otp" width="100%" large dark class="tw-py-3">
          {{ $t("login.send-sms") }}
        </ada-btn>
      </v-card-actions>
      <div v-html="$t('login.alerts')" class="mt-3 text-justify"></div>
    </v-card>

    <virtual-keyboard
      class="tw-absolute tw-bottom-0 tw-left-0 tw-h-1/2 md:tw-h-full tw-w-full md:tw-w-2/6 tw-m-auto tw-z-10 tw-border tw-rounded" />
  </div>
</template>

<style lang="postcss" scoped>
.res-ct {
  position: relative;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 calc(50% - 257px) !important;
}

.res-crd {
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
