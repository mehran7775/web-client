<script lang="ts">
export default {
  layout: "public",
};
</script>
<script setup lang="ts">
import { ref } from "#app";
import { useRouter } from "#app";

const router = useRouter();
const userName = ref("");
const loading = ref(false);
function otp() { }
function captchaResult() { }
function back() {
  router.push("/login");
}
</script>

<template>
  <div class="ma-0 pa-0 res-ct">
    <div class="pie pie-1"></div>
    <div class="pie pie-2"></div>
    <v-card elevation="0" class="dotted res-crd" :loading="loading">
      <div class="ma-0 pa-0 justify-center text-center">
        <ada-icon :size="24" class="back" @click="back"> mdi-arrow-right </ada-icon>
        <nuxt-link to="/about-us" class="logo" />
        <h3>{{ $t("login.forget-password") }}</h3>
      </div>
      <v-card-text class="text-center">
        <v-form>
          <v-text-field v-model="userName" :placeholder="$t('user.username')" prepend-inner-icon="mdi-account"
            class="my-2" outlined hide-details dense>
          </v-text-field>
          <simple-captcha tabindex="1" :height="42" outlined dense />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn depressed color="primary" @click="otp" width="100%" large dark>
          {{ $t("login.send-sms") }}
        </v-btn>
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
}

.v-application--is-rtl {
  .back {
    right: 39px;
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
