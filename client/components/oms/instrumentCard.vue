<template>
  <v-container fluid>
    <v-row dense>
      <v-col>{{ $t("instrument.status") }}</v-col>
      <v-col> {{ instrument.status }} </v-col>
      <v-col>{{ $t("instrument.lastTradeDate") }}</v-col>
      <v-col> {{ instrument.lastTradeDate }} </v-col>
    </v-row>
    <v-row dense>
      <v-col>{{ $t("instrument.allowedPrice") }}</v-col>
      <v-col>
        {{ instrument.minAllowedPrice + "-" + instrument.maxAllowedPrice }}
      </v-col>
      <v-col>{{ $t("instrument.quantityPerOrder") }}</v-col>
      <v-col>
        {{
          instrument.maxQuantityPerOrder + "-" + instrument.maxQuantityPerOrder
        }}
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>{{ $t("instrument.tradeVol") }}</v-col>
      <v-col> {{ instrument.tradeVol }} </v-col>
      <v-col>{{ $t("instrument.tradeVal") }}</v-col>
      <v-col> {{ instrument.tradeVal }} </v-col>
      <v-col>{{ $t("instrument.marketVal") }}</v-col>
      <v-col> {{ instrument.marketVal }} </v-col>
    </v-row>
    <v-row dense>
      <v-col>{{ $t("instrument.lowest") }}</v-col>
      <v-col> {{ instrument.lowest }} </v-col>
      <v-col>{{ $t("instrument.highest") }}</v-col>
      <v-col> {{ instrument.highest }} </v-col>
      <v-col>{{ $t("instrument.last") }}</v-col>
      <v-col> {{ instrument.last }} </v-col>
    </v-row>
    <v-row dense>
      <v-col>{{ $t("instrument.buyPrice") }}</v-col>
      <v-col> {{ instrument.buyPrice }} </v-col>
      <v-col>{{ $t("instrument.sellPrice") }}</v-col>
      <v-col> {{ instrument.sellPrice }} </v-col>
      <v-col>{{ $t("instrument.closing") }}</v-col>
      <v-col> {{ instrument.closing }} </v-col>
    </v-row>
    <v-row dense>
      <v-col>{{ $t("instrument.shares") }}</v-col>
      <v-col>{{ instrument.shares }}</v-col>
      <v-col>{{ $t("instrument.baseVol") }}</v-col>
      <v-col>{{ instrument.baseVol }}</v-col>
      <v-col>{{ $t("instrument.tradingShares") }}</v-col>
      <v-col>{{ instrument.floating }}</v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, useStore, ref, Ref } from "@nuxtjs/composition-api";
import { Instrument } from "@/types/oms";

export default defineComponent({
  name: "instrumnet-card",
  props: ["insId"],
  setup(props, context) {
    const store = useStore();
    let instrument: Ref<Instrument> = ref(new Instrument());
    store
      .dispatch("instruments/getInstrumentsDetail", [props.insId])
      .then((data: Array<Instrument>) => {
        instrument.value = data[0];
      });

    return {
      instrument,
    };
  },
});
</script>

