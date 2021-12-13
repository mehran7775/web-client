<template>
  <v-data-table :items="res" :headers="headers" dense> </v-data-table>
</template>

<script lang="ts">
import { defineComponent, useStore, reactive } from "@nuxtjs/composition-api";
import { Paginated, Log, WatchlistColumns } from "@/types";

export default defineComponent({
  setup() {
    const store = useStore();
    const res: Array<Log> = reactive([]);
    const headers: Array<WatchlistColumns> = [
      new WatchlistColumns("dateTime", "dateTime"),
      new WatchlistColumns("ip", "ip"),
      new WatchlistColumns("type", "type"),
    ];
    const searchParam: Paginated = new Paginated(0, 10);
    store.dispatch("sso/user/getLogs", searchParam).then((resp) => {
      res.push(...resp.data.data);
    });
    return {
      res,
      headers,
    };
  },
});
</script>

