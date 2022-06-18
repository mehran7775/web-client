<script lang="ts">
export default {
  layout: "public",
};
</script>
<script setup lang="ts">
import { useVirtualKeyBoard } from "@/utils/virtualKeyBoard";
import { ref } from "#app";
import { useRouter } from "#app";

const router = useRouter();
const userName = ref("");
const loading = ref(false);
const keyboard = ref(useVirtualKeyBoard());
function otp() { }
function captchaResult() { }
function back() {
  router.push("/login");
}
</script>

<template>
  <div class="res-ct">
    <div class="pie pie-1"></div>
    <div class="pie pie-2"></div>
    <v-card elevation="0" class="dotted res-crd" :loading="loading">
     <ada-icon color="gray" :size="24" class="back" @click="back"> mdi-arrow-right </ada-icon>
      <div class="justify-center text-center">
        <nuxt-link to="/about-us" class="logo" />
        <h3>{{ $t("login.forget-password") }}</h3>
      </div>
      <v-card-text class="text-center tw-px-3">
        <v-form>
          <p class="tw-mt-[16px] tw-mb-2 tw-text-right tw-text-base">{{ $t("user.username") }}</p>
          <v-text-field v-model="userName" :placeholder="$t('user.username')" prepend-inner-icon="isax-user"
            class="my-2" outlined hide-details dense aria-lable="username"
            @focus="
              () => {
                if (keyboard.active)
                  keyboard.setListener((key) => {
                    userName = userName + key;
                  });
              }
            "
            >
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
          <simple-captcha tabindex="1" :height="42" outlined dense 
          @focus="() => keyboard.active = false "
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <ada-btn depressed color="primary" @click="otp" width="100%" large dark class="tw-py-3">
          {{ $t("login.send-sms") }}
        </ada-btn>
      </v-card-actions>
      <div v-html="$t('login.alerts')" class="mt-3 text-justify"></div>
    </v-card>
  </div>
</template>

<style lang="postcss" scoped>
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
