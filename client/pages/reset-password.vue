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
      <ada-icon color="gray" :size="24"
        :class="['tw-absolute tw-top-20', !rtl ? 'tw-left-10 tw-rotate-180' : 'tw-left-auto tw-right-10']"
        @click="back"> mdi-arrow-right </ada-icon>
      <div class="text-center">
        <nuxt-link tabindex="-1" to="/about-us" class="logo" />
        <h3>{{ $t("login.forget-password") }}</h3>
      </div>
      <v-card-text class="tw-px-3">
        <form>
          <text-input v-model="userName" tabIndex="1" ref="userref" :label="$t('user.username')" class="tw-block"
            bg="white" maxWidth="100%" @focus.native="
            () => {
              () => {
                if (keyboard.active)
                  keyboard.setListener((key) => {
                    userName = userName + key;
                  });
              }
            }">
            <template #prepend="{ active }">
              <ada-icon :size="21" :color="[active ? 'primary' : 'black']">isax-user</ada-icon>
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
          </text-input>
          <label for="captcha" class="tw-block tw-mb-2 tw-mt-3 tw-text-base">{{ $t("login.captcha") }}</label>
          <simple-captcha :height="42" outlined dense id="captcha"
            @focus="() => keyboard.active = false" />
        </form>
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

  .ada-input {
    @apply tw-mt-4;

    .label {
      @apply tw-my-2;
    }

    .scaffold {
      @apply tw-border tw-border-gray4 tw-px-3 tw-h-16;

      &.active {
        @apply tw-border-primary;
      }
    }
  }
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
<style lang="postcss">
.res-crd {
  .ada-input {
    @apply tw-mt-4;

    .label {
      @apply tw-my-2;
    }

    .scaffold {
      @apply tw-border tw-border-gray4 tw-px-3 tw-h-16;

      &.active {
        @apply tw-border-primary;
      }
    }
  }
}
</style>