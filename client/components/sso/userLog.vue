<script setup lang="ts">
import { reactive, useNuxtApp } from "#app";
import { Paginated, Log, WatchlistColumns } from "@/types";
import { DateTime } from "luxon";
import { useAsrTrader, useUser } from "~/composables";

const userManager = useUser();
const appManager = useAsrTrader();
const { $i18n: i18n } = useNuxtApp();
const res: Array<Log> = reactive([]);
const headers: Array<WatchlistColumns> = [
  new WatchlistColumns("dateTime", "dateTime"),
  new WatchlistColumns("ip", "ip"),
  new WatchlistColumns("type", "type"),
];
const searchParam: Paginated = { offset: 0, length: 10 };
const locale = appManager.locale;
function printDate(date: string) {
  return DateTime.fromISO(date)
    .setLocale(locale)
    .toFormat(i18n.t("general.date.longdt").toString());
}
function printType(typ: string) {
  return i18n.t("log." + typ);
}
userManager.getLogs(searchParam).then((resp) => {
  res.push(...resp.data.data);
});
defineExpose({
  res,
  headers,
  printDate,
  printType,
});
</script>

<template>
  <ada-data-table :items="res" :headers="headers" dense>
    <template #item.dateTime="{ item }">
      {{ printDate(item.dateTime) }}
    </template>
    <template #item.type="{ item }">
      {{ printType(item.type) }}
    </template>
  </ada-data-table>
</template>
