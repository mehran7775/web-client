<template lang="vue">
<v-container fluid class="text-no-wrap ma-0 pa-0">
    <v-row v-show="!hideHeaders" dense>
      <v-col md="12" class="text-center">
        {{ $t("instrument.detail") }}
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-space-between text-wrap ma-0 pa-0 px-3 col-border">
        <span>{{ $t("oms.count") }}</span>
        <span>{{ instrument.totalTrades }}</span>
        <span>{{ $t("oms.volume") }}</span>
        <span>{{ instrument.totalShares }}</span>
        <span>{{ $t("oms.value") }}</span>
        <span>{{ instrument.totalTradesValue }}</span>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col md="6" class="d-flex justify-space-between text-wrap ma-0 pa-0 px-3 col-border">
        <span>{{ $t("instrument.closing") }}</span>
        <span>{{ instrument.closing }}</span>
        <bar />
      </v-col>
      <v-col md="6" class="d-flex justify-space-between text-wrap ma-0 pa-0 px-3 col-border">
        <span>{{ $t("instrument.last") }}</span>
        <span>{{ instrument.last }}</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, useStore, ref, Ref, computed } from "@nuxtjs/composition-api";
import { Instrument, InstrumentCache, InstrumentSearchModel } from "@/types";
import { DateTime } from "luxon";
import { useAsrTrader, useInstrument } from "~/composables";

export default defineComponent({
  name: "instrumnet-card-compact",
  props: {
    responsive: Boolean,
    insId: { type: Number, required: true },
    hideHeaders: Boolean,
  },
  setup(props, context) {
    const store = useStore();
    const appManager = useAsrTrader(store);
    const instrumentManager = useInstrument(store);
    const locale = appManager.locale;
    let instrument: Ref<InstrumentCache> = ref(new InstrumentCache());
    instrumentManager
      .getInstrumentsDetail(new InstrumentSearchModel([props.insId]))
      .then((data) => {
        instrument.value = data[0];
      });
    return {
      DateTime,
      locale,
      instrument,
    };
  },
});
</script>

<style lang="sass" scoped>
.col-border
  position: relative
  vertical-align: middle
  justify-items: center
  background-color: rgba(224,224,224,0.2)
</style>