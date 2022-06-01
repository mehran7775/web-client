<script setup lang="ts">
import { useAsrTrader } from "~~/composables";
import { computed } from "#app";
import { DateTime } from "luxon";

const props = withDefaults(
  defineProps<{
    value: string;
    format: string;
  }>(),
  {
    value: DateTime.now().toISO(),
    format: "yyyy-MM-dd HH:mm:ss",
  }
);
const app = useAsrTrader();
const date = computed(() =>
  DateTime.fromISO(props.value, {
    locale: app.locale,
    outputCalendar: app.locale,
  }).toFormat(props.format)
);
</script>
<template>
  <span dir="ltr">{{ date }}</span>
</template>
