<script setup lang="ts">
import { Ref } from "vue";
import { InstrumentCache, InstrumentSearchModel } from "@/types";
import { useInstrument } from "~/composables";

const props = withDefaults(
  defineProps<{
    responsive?: boolean;
    insId: number;
    hideHeaders?: boolean;
  }>(),
  { responsive: false, hideHeaders: false }
);

const instrumentManager = useInstrument();
let instrument: Ref<InstrumentCache> = ref(new InstrumentCache());
instrumentManager
  .getInstrumentsDetail(new InstrumentSearchModel([props.insId]))
  .then((data) => {
    instrument.value = data[0];
  });
defineExpose({
  instrument,
});
</script>

<style lang="postcss" scoped>
.instrument {
  @apply tw-grid tw-grid-cols-6 tw-gap-0;
  > div {
    @apply tw-whitespace-nowrap tw-flex tw-justify-between tw-px-4;
    position: relative;
    height: var(--row-height);
    line-height: var(--row-height);
    background-color: rgba(var(--c-primary), 0.05);
  }
  .header {
    color: var(--c-info-rgb);
  }
  .col-border {
    border-bottom: 1px solid #e0e0e0;
  }
}
</style>

<template>
  <div class="instrument">
    <div v-show="!hideHeaders" class="tw-text-center tw-col-span-6">
      {{ $t("instrument.detail") }}
    </div>
    <div class="tw-col-span-6 col-border">
      <span class="header">{{ $t("oms.count") }}</span>
      <numeric-field v-model="instrument.totalTrades"></numeric-field>
      <span class="header">{{ $t("oms.volume") }}</span>
      <numeric-field v-model="instrument.totalShares"></numeric-field>
      <span class="header">{{ $t("oms.value") }}</span>
      <numeric-field v-model="instrument.totalTradesValue"></numeric-field>
    </div>
    <div class="tw-col-span-3 col-border">
      <span class="header">{{ $t("instrument.closing") }}</span>
      <span>{{ instrument.closing }}</span>
      <div class="bar"></div>
    </div>
    <div class="tw-col-span-3 col-border">
      <span class="header">{{ $t("instrument.last") }}</span>
      <span>{{ instrument.last }}</span>
    </div>
  </div>
</template>
