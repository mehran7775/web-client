<script lang="ts">
import { useRuntimeConfig } from "#app";
import { Ref } from "vue";
import { required } from "@/utils/rules";

export default defineComponent({
  inheritAttrs: false,
  props: ["modelValue", "height", "tabIndex"],
  setup(props, ctx) {
    const config = useRuntimeConfig();
    const appManager = useAsrTrader();
    const captcharef: Ref<any> = ref(null);
    const url =
      config.public.VUE_APP_Host +
      "sso/captcha?width=100&height=" +
      ((props.height ?? 42) - 8) +
      "&r=";
    const captchaUrl = ref(url);
    const locale = appManager.locale;
    const captcha = computed({
      get() {
        return props.modelValue;
      },
      set(val) {
        ctx.emit("update:modelValue", val);
      },
    });
    function refreshCaptcha() {
      captchaUrl.value = url + (Math.random() * 1000000).toString() + "&lang=" + locale;
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

<template>
  <div class="captcha">
    <ada-input v-model="captcha" ref="captcharef" v-bind="$attrs" :placeholder="$t('login.placeholder-captch')"
      bg="white" class="tw-block" maxWidth="100%" :tabIndex="tabIndex" :label="$t('login.captcha')">
      <template #append>
        <img :src="captchaUrl" alt="" :height="height - 8" class="tw-my-0 tw-ml-0 tw-mr-3 tw-p-0 tw-inline-block">
        <ada-icon :size="24" class="tw-mt-1" @click="refreshCaptcha"> isax-refresh-2 </ada-icon>
      </template>
    </ada-input>
    <div v-if="captcharef && !captcharef.isFocused && !captcharef.valid" class="error--text" style="font-size: 10px">
      <div v-for="item in captcharef.validations" :key="item" class="pt-2">
        <ada-icon color="error" :size="17"> mdi-alert-circle-outline</ada-icon>
        <span style="display: inline-block">
          {{ $t(item) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
</style>
