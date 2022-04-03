<script setup lang="ts">
import { ref } from "#app";
import { DateTime } from "luxon";
import { useAsrTrader } from "~/composables";

const params = withDefaults(
  defineProps<{
    format: string;
    width: string | number;
  }>(),
  {
    format: "HH:mm:ss",
    width: "auto",
  }
);

const appManager = useAsrTrader();
const locale = appManager.locale;
const date = ref(DateTime.now().setLocale(locale));
setInterval(() => {
  date.value = DateTime.now().setLocale(locale);
}, 1000);
</script>

<template>
  <div :style="{ width: width }">
    {{ date.toFormat(format) }}
  </div>
</template>
