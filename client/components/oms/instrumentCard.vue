<template>
  <v-container fluid class="text-no-wrap">
    <v-row dense>
      <v-col cols="12" class="text-center">
        {{ $t("instrument.detail") }}
      </v-col>
      <v-col cols="6" class="d-flex justify-space-between">
        <span>
          {{ $t("instrument.lastTradeDate") }}
        </span>
        <span>
          {{
            moment(instrument.lastTradeDate)
              .locale(locale)
              .format($t("general.date.dt"))
          }}
        </span>
      </v-col>
      <v-col cols="6" class="d-flex justify-space-between">
        <span>{{ $t("instrument.lowest") }}</span>
        <span>{{ instrument.lowest }}</span>
      </v-col>
      <v-col cols="6" class="d-flex justify-space-between">
        <span>{{ $t("instrument.marketVal") }}</span>
        <span>{{ instrument.marketVal }}</span>
      </v-col>
      <v-col cols="6" class="d-flex justify-space-between">
        <span>{{ $t("instrument.highest") }}</span>
        <span>{{ instrument.highest }}</span>
      </v-col>
      <v-col cols="6" class="d-flex justify-space-between">
        <span>{{ $t("instrument.tradeCount") }}</span>
        <span>{{ instrument.tradeCount }}</span>
      </v-col>
      <v-col cols="6" class="d-flex justify-space-between">
        <span>{{ $t("instrument.last") }}</span>
        <span>{{ instrument.last }}</span>
      </v-col>
      <v-col cols="6" class="d-flex justify-space-between">
        <span>{{ $t("instrument.tradeVol") }}</span>
        <span>{{ instrument.tradeVol }}</span>
      </v-col>
      <v-col cols="6" class="d-flex justify-space-between">
        <span>{{ $t("instrument.closing") }}</span>
        <span>{{ instrument.closing }}</span>
      </v-col>
      <v-col cols="6" class="d-flex justify-space-between">
        <span>{{ $t("instrument.tradeVal") }}</span>
        <span>{{ instrument.tradeVal }}</span>
      </v-col>
      <v-col cols="6" class="d-flex justify-space-between">
        <span>{{ $t("instrument.buyPrice") }}</span>
        <span>{{ instrument.buyPrice }}</span>
      </v-col>
      <v-col cols="6" class="d-flex justify-space-between">
        <span>{{ $t("instrument.opening") }}</span>
        <span>{{ instrument.opening }}</span>
      </v-col>
      <v-col cols="6" class="d-flex justify-space-between">
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
import { Instrument } from "@/types/oms";
import moment from "moment-jalaali";

export default defineComponent({
  name: "instrumnet-card",
  props: ["insId"],
  setup(props, context) {
    const store = useStore();
    const locale = computed(() => store.getters["locale"]);
    let instrument: Ref<Instrument> = ref(new Instrument());
    store
      .dispatch("instruments/getInstrumentsDetail", [props.insId])
      .then((data: Array<Instrument>) => {
        instrument.value = data[0];
      });
    return {
      moment,
      locale,
      instrument,
    };
  },
});
</script>

