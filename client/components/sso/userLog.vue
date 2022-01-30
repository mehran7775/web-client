<template>
  <v-data-table :items="res" :headers="headers" dense>
    <template #item.dateTime="{ item }">
      {{ printDate(item.dateTime) }}
    </template>
    <template #item.type="{ item }">
      {{ printType(item.type) }}
    </template>
  </v-data-table>
</template>

<script lang="ts">
import {
  defineComponent,
  useStore,
  reactive,
  computed,
} from "@nuxtjs/composition-api";
import { Paginated, Log, WatchlistColumns } from "@/types";
import { DateTime } from "luxon";
import { useAsrTrader, useUser } from "~/composables";

export default defineComponent({
  setup(props, context) {
    const store = useStore();
    const userManager = useUser(store);
    const appManager = useAsrTrader(store);
    const i18n = useI18n();
    const res: Array<Log> = reactive([]);
    const headers: Array<WatchlistColumns> = [
      new WatchlistColumns("dateTime", "dateTime"),
      new WatchlistColumns("ip", "ip"),
      new WatchlistColumns("type", "type"),
    ];
    const searchParam: Paginated = new Paginated(0, 10);
    const locale = appManager.locale;
    function printDate(date: string) {
      return DateTime.fromISO(date)
        .setLocale(locale.value)
        .toFormat(i18n.t("general.date.longdt").toString());
    }
    function printType(typ: string) {
      return i18n.t("log." + typ.toLowerCase());
    }
    userManager.getLogs(searchParam).then((resp) => {
      res.push(...resp.data.data);
    });
    return {
      res,
      headers,
      printDate,
      printType,
    };
    //TODO remove in vue3
    function useI18n() {
      return context.root.$i18n;
    }
  },
});
</script>

