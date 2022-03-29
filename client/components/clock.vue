<script setup lang="ts">
import { ref } from "@vue/composition-api";
import { DateTime } from "luxon";
import { useAsrTrader } from "~/composables";

const params = defineProps<{
  format: string;
  width: string | number;
}>();

const appManager = useAsrTrader();
const locale = appManager.locale;
const date = ref(DateTime.now().setLocale(locale));
setInterval(() => {
  date.value = DateTime.now().setLocale(locale);
}, 1000);
</script>

<template>
  <div :style="{ width: width + 'px' }">
    {{ date.toFormat(format) }}
  </div>
</template>
