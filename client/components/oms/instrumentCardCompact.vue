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
        <numeric-field v-model="instrument.totalTrades"></numeric-field>
        <span>{{ $t("oms.volume") }}</span>
        <numeric-field v-model="instrument.totalShares"></numeric-field>
        <span>{{ $t("oms.value") }}</span>
        <numeric-field v-model="instrument.totalTradesValue"></numeric-field>
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
import { defineComponent, useStore, ref, Ref } from "@nuxtjs/composition-api";
import { InstrumentCache, InstrumentSearchModel } from "@/types";
import { useInstrument } from "~/composables";

export default defineComponent({
  name: "instrumnet-card-compact",
  props: {
    responsive: Boolean,
    insId: { type: Number, required: true },
    hideHeaders: Boolean,
  },
  setup(props, context) {
    const store = useStore();
    const instrumentManager = useInstrument(store);
    let instrument: Ref<InstrumentCache> = ref(new InstrumentCache());
    instrumentManager
      .getInstrumentsDetail(new InstrumentSearchModel([props.insId]))
      .then((data) => {
        instrument.value = data[0];
      });
    return {
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
