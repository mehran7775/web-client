<script setup lang="ts">
import { Ref } from "vue";
import { useInstrument } from "@/composables";
import { Instrument, InstrumentSearchModel } from "@/types";
import { field, fieldType } from "./types";

const props = withDefaults(
  defineProps<{
    responsive?: boolean;
    compact?: boolean;
    insId?: number;
    insName?: string,
    hideHeaders?: boolean;
  }>(),
  {
    responsive: false,
    compact: false,
    hideHeaders: false,
  }
);

const emit = defineEmits(["count", "price"]);

const instrumentManager = useInstrument();

const fields: Array<field> = [
  new field("yesterdayPrice", fieldType.price, null, getClickEvent(fieldType.price)),
  new field("totalTrades", fieldType.count, "oms.tradeCount"),
  new field("opening", fieldType.price, null, getClickEvent(fieldType.price)),
  new field("totalShares", fieldType.count, "oms.tradeAmount"),
  new field("lowest", fieldType.price, null, getClickEvent(fieldType.price)),
  new field("totalTradesValue", fieldType.price, "oms.tradeValue"),
  new field("highest", fieldType.price, null, getClickEvent(fieldType.price)),
  new field("marketValue", fieldType.price, "oms.marketValue"),
  new field(
    "lastPrice",
    fieldType.price,
    "instrument.last",
    getClickEvent(fieldType.price)
  ),
  new field("buyPrice", fieldType.price, "oms.buyPrice", getClickEvent(fieldType.price)),
  new field("closing", fieldType.price, null, getClickEvent(fieldType.price)),
  new field("sellPrice", fieldType.price, "oms.buyPrice", getClickEvent(fieldType.price)),
  new field("tomorrowThreshold", fieldType.text, "oms.tomorrowThreshold"),
  new field("baseVol", fieldType.number, null),
  new field("todayRange", fieldType.text, "oms.todayRange"),
  new field("lastTradeDate", fieldType.dateTime, null),
];
let instrument: Ref<Instrument> = ref(new Instrument());
function getClickEvent(type: fieldType) {
  switch (type) {
    case fieldType.price:
      return (value: any) => {
        emit("price", value);
      };
    case fieldType.count:
      return (value: any) => {
        emit("count", value);
      };
    default:
      return undefined;
  }
}
instrumentManager
  .getInstrumentsDetail(new InstrumentSearchModel([props.insId]))
  .then((data: Array<Instrument>) => {
    instrument.value = data[0];
  });
</script>

<style lang="postcss" scoped>
.instrument {
  @apply tw-grid tw-grid-cols-2;
  > header {
    @apply tw-flex tw-justify-center tw-col-span-2;
    background-color: #e0e0e0;
    line-height: var(--row-height);
    height: var(--row-height);
    font-weight: bold;
  }
  > div {
    @apply tw-flex tw-justify-between tw-px-4;
    position: relative;
    line-height: var(--row-height);
    height: var(--row-height);
  }
  .col-border {
    border-bottom: 1px solid #e0e0e0;
  }
}
</style>

<template>
  <div class="instrument">
    <header v-show="!hideHeaders">
      {{ $t("instrument.detail") }} ({{insName}})
    </header>
    <div
      v-for="(field, index) in fields"
      :key="field.name"
      :class="{
        'copy-cursor': !!field.click,
        'col-border': true,
      }"
      @click="
        () => {
          if (field.click) field.click(instrument[field.name]);
        }
      "
    >
      <span>{{ $t(field.i18n) }}</span>
      <date-time
        v-if="field.type == fieldType.dateTime"
        :value="instrument[field.name]"
      ></date-time>
      <span v-else-if="field.type == fieldType.text">{{ instrument[field.name] }}</span>
      <numeric-field v-else :value="instrument[field.name]"> </numeric-field>
      <div v-if="index % 2 == 0" class="bar d-none d-md-block"></div>
    </div>
  </div>
</template>
