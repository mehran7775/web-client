<template>
  <div>
    <v-text-field
      class="captcha"
      aria-label="Picture Captcha"
      aria-required="true"
      ref="captcharef"
      v-model="captcha"
      :rules="[rules.required]"
      hide-details
      v-on="$listeners"
      v-bind="$attrs"
    >
      <template #append>
        <v-img
          :src="captchaUrl"
          :height="height - 8"
          class="ma-0 me-3 pa-0 d-inline-block"
        >
        </v-img>
        <v-icon class="mt-1" @click="refreshCaptcha"> adaico-refresh-2 </v-icon>
      </template>
    </v-text-field>
    <div
      v-if="captcharef && !captcharef.isFocused && !captcharef.valid"
      class="error--text"
      style="font-size: 10px"
    >
      <div v-for="item in captcharef.validations" :key="item" class="pt-2">
        <v-icon color="error" size="17"> mdi-alert-circle-outline</v-icon>
        <span style="display: inline-block">
          {{ $t(item) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  computed,
  useStore,
} from "@nuxtjs/composition-api";
import { required } from "@/utils/rules";

export default defineComponent({
  inheritAttrs: false,
  props: ["value", "height"],
  setup(props, ctx) {
    const store = useStore();
    const captcharef: Ref<any> = ref(null);
    const url =
      process.env.VUE_APP_Host +
      "sso/captcha?width=100&height=" +
      ((props.height ?? 42) - 8) +
      "&r=";
    const captchaUrl = ref(url);
    const locale = computed(() => store.getters["locale"]);
    const captcha = computed({
      get() {
        return props.value;
      },
      set(val) {
        ctx.emit("input", val);
      },
    });
    function refreshCaptcha() {
      captchaUrl.value =
        url + (Math.random() * 1000000).toString() + "&lang=" + locale.value;
    }
    refreshCaptcha();
    return {
      captcharef,
      captchaUrl,
      refreshCaptcha,
      captcha,
      rules: { required },
      focus: () => captcharef.value?.focus(),
      validate: () => captcharef.value?.validate(),
    };
  },
});
</script>

<style lang="sass">
.captcha
  .v-input__append-inner
    margin-top: 3px !important
</style>
