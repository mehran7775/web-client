<template>
  <v-container fluid class="text-no-wrap ma-0 py-0">
    <v-row v-show="!hideHeaders" dense>
      <v-col md="12" class="text-center">
        {{ $t("instrument.detail") }}
      </v-col>
    </v-row>
    <v-row dense>
      <v-col
        v-for="field in fields"
        :key="field.name"
        md="6"
        :class="{
          'copy-cursor': !!field.click,
          'col-sm-12': responsive,
          'oddodd d-flex justify-space-between': true,
        }"
        @click="
          () => {
            if (field.click) field.click(instrument[field.name]);
          }
        "
      >
        <span>{{ $t(field.i18n) }}</span>
        <span>
          {{ printField(instrument[field.name], field.type) }}
        </span>
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
import { Instrument } from "@/types";
import { DateTime } from "luxon";

export default defineComponent({
  name: "instrumnet-card-compact",
  props: {
    responsive: Boolean,
    compact: Boolean,
    insId: Number,
    "hide-headers": Boolean,
  },
  setup(props, context) {
    const store = useStore();
    const i18n = useI18n();
    const locale = computed(() => store.getters["locale"]);
    const fields: Array<field> = [
      new field(
        "lastClosing",
        fieldType.price,
        null,
        getClickEvent(fieldType.price)
      ),
      new field("tradeCount", fieldType.count, null),
      new field(
        "opening",
        fieldType.price,
        null,
        getClickEvent(fieldType.price)
      ),
      new field("tradeAmount", fieldType.count, "oms.tradeAmount"),
      new field(
        "lowest",
        fieldType.price,
        null,
        getClickEvent(fieldType.price)
      ),
      new field("tradeValue", fieldType.price, "oms.tradeValue"),
      new field(
        "highest",
        fieldType.price,
        null,
        getClickEvent(fieldType.price)
      ),
      new field("marketValue", fieldType.price, "oms.marketValue"),
      new field("last", fieldType.price, null, getClickEvent(fieldType.price)),
      new field(
        "buyPrice",
        fieldType.price,
        "oms.buyPrice",
        getClickEvent(fieldType.price)
      ),
      new field(
        "closing",
        fieldType.price,
        null,
        getClickEvent(fieldType.price)
      ),
      new field(
        "sellPrice",
        fieldType.price,
        "oms.buyPrice",
        getClickEvent(fieldType.price)
      ),
      new field("tomorrowThreshold", fieldType.text, "oms.tomorrowThreshold"),
      new field("baseVol", fieldType.text, null),
      new field("todayRange", fieldType.text, "oms.todayRange"),
      new field("lastTradeDate", fieldType.dateTime, null),
    ];
    let instrument: Ref<Instrument> = ref(new Instrument());
    function printField(data: any, type: fieldType) {
      switch (type) {
        case fieldType.dateTime:
          return DateTime.fromISO(data)
            .setLocale(locale.value)
            .toFormat(i18n.t("general.date.dt").toString());
        default:
          return data;
      }
    }
    function getClickEvent(type: fieldType) {
      switch (type) {
        case fieldType.price:
          return (value: any) => {
            context.emit("count", value);
          };
        default:
          return undefined;
      }
    }
    store
      .dispatch("oms/instruments/getInstrumentsDetail", [props.insId])
      .then((data: Array<Instrument>) => {
        instrument.value = data[0];
      });
    return {
      getClickEvent,
      printField,
      fields,
      DateTime,
      locale,
      instrument,
    };
    //TODO remove in vue3
    function useI18n() {
      return context.root.$i18n;
    }
  },
});

enum fieldType {
  text = 0,
  number = 1,
  dateTime = 2,
  count = 98,
  price = 99,
}

class field {
  name: string;
  type: fieldType;
  i18n: string;
  click: Function | null;
  constructor(
    name: string,
    type: fieldType = fieldType.text,
    i18n: string | null = null,
    click: Function | null = null
  ) {
    this.name = name;
    this.type = type;
    this.i18n = i18n ?? "instrument." + name;
    this.click = click;
  }
}
</script>

