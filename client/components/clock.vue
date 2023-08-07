<script setup lang="ts">
import { ref } from "vue";
import { DateTime } from "luxon";
import { useAsrTrader } from "~/composables";

const params = withDefaults(
  defineProps<{
    format?: string;
  }>(),
  {
    format: "HH:mm:ss",
  }
);

const appManager = useAsrTrader();
const locale = appManager.locale;
const date = ref(DateTime.now().setLocale(locale));
setInterval(() => {
  date.value = DateTime.now().setLocale(locale);
}, 1000);
</script>

<style lang="postcss" scoped>
.clock{
  @apply tw-leading-none tw-justify-start;
}
</style>

<template>
  <span class="clock">
    {{ date.toFormat(format) }}
  </span>
</template>
