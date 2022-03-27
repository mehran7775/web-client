<script setup lang="ts">
import { ref } from "@vue/composition-api";
import { DateTime } from "luxon";
import { useAsrTrader } from "~/composables";
import { useNuxtApp } from "#app";

const params = defineProps<{
  format: string;
  width: string | number;
}>();

const { $store: store } = useNuxtApp();
const appManager = useAsrTrader(store);
const locale = appManager.locale;
const date = ref(DateTime.now().setLocale(locale.value));
setInterval(() => {
  date.value = DateTime.now().setLocale(locale.value);
}, 1000);
</script>

<template>
  <div :style="{ width: width + 'px' }">
    {{ date.toFormat(format) }}
  </div>
</template>
