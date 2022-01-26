<template>
  <v-container fluid class="text-no-wrap ma-0 py-0">
    <v-row v-show="!hideHeaders" dense>
      <v-col md="12" class="text-center">
        {{ $t("instrument.detail") }}
      </v-col>
    </v-row>
    <v-row class="striped" dense>
      <v-col md="6" class="d-flex justify-space-between text-wrap">
        <span>
          {{ $t("instrument.lastTradeDate") }}
        </span>
        <span>
          {{
            DateTime.fromISO(instrument.lastTradeDate)
              .setLocale(locale)
              .toFormat($t("general.date.dt"))
          }}
        </span>
      </v-col>
      <v-col md="6" class="d-flex justify-space-between">
        <span>{{ $t("instrument.lowest") }}</span>
        <span>{{ instrument.lowest }}</span>
      </v-col>
    </v-row>
    <v-row class="striped" dense>
      <v-col md="6" class="d-flex justify-space-between">
        <span>{{ $t("instrument.marketVal") }}</span>
        <span>{{ instrument.marketVal }}</span>
      </v-col>
      <v-col md="6" class="d-flex justify-space-between">
        <span>{{ $t("instrument.highest") }}</span>
        <span>{{ instrument.highest }}</span>
      </v-col>
    </v-row>
    <v-row class="striped" dense>
      <v-col md="6" class="d-flex justify-space-between">
        <span>{{ $t("instrument.tradeCount") }}</span>
        <span>{{ instrument.tradeCount }}</span>
      </v-col>
      <v-col md="6" class="d-flex justify-space-between">
        <span>{{ $t("instrument.last") }}</span>
        <span>{{ instrument.last }}</span>
      </v-col>
    </v-row>
    <v-row class="striped" dense>
      <v-col md="6" class="d-flex justify-space-between">
        <span>{{ $t("instrument.tradeVol") }}</span>
        <span>{{ instrument.tradeVol }}</span>
      </v-col>
      <v-col md="6" class="d-flex justify-space-between">
        <span>{{ $t("instrument.closing") }}</span>
        <span>{{ instrument.closing }}</span>
      </v-col>
    </v-row>
    <v-row class="striped" dense>
      <v-col md="6" class="d-flex justify-space-between">
        <span>{{ $t("instrument.tradeVal") }}</span>
        <span>{{ instrument.tradeVal }}</span>
      </v-col>
      <v-col md="6" class="d-flex justify-space-between">
        <span>{{ $t("oms.buyPrice") }}</span>
        <span>{{ instrument.buyPrice }}</span>
      </v-col>
    </v-row>
    <v-row class="striped" dense>
      <v-col md="6" class="d-flex justify-space-between">
        <span>{{ $t("instrument.opening") }}</span>
        <span>{{ instrument.opening }}</span>
      </v-col>
      <v-col md="6" class="d-flex justify-space-between">
        <span>{{ $t("instrument.baseVol") }}</span>
        <span>{{ instrument.baseVol }}</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  useStore,
  ref,
  Ref,
  computed,
} from "@nuxtjs/composition-api";
import { Instrument, InstrumentSearchModel } from "@/types";
import { DateTime } from "luxon";
import { useAsrTrader, useInstrument } from "~/composables";

export default defineComponent({
  name: "instrumnet-card-compact",
  props: {
    responsive: Boolean,
    insId: { type: Number, required: true },
    "hide-headers": Boolean,
  },
  setup(props, context) {
    const store = useStore();
    const appManager = useAsrTrader(store);
    const instrumentManager = useInstrument(store);
    const locale = appManager.locale;
    let instrument: Ref<Instrument> = ref(new Instrument());
    instrumentManager
      .getInstrumentsDetail(new InstrumentSearchModel([props.insId]))
      .then((data: Array<Instrument>) => {
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

