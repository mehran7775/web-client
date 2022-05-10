<script setup lang="ts">
import { reactive, ref, computed, Ref } from "#app";
import { InstrumentCache, InstrumentSearchModel, OrderQueueItem } from "@/types";
import { useAsrTrader, useInstrument } from "~/composables";
import doubleBarChart from "../doubleBarChart.vue";

const emit = defineEmits(["count", "price"]);
const props = withDefaults(
  defineProps<{
    insId: number;
    copy: boolean;
    responsive: boolean;
    "extra-col": boolean;
  }>(),
  {
    copy: false,
    responsive: false,
    "extra-col": false,
  }
);

const appManager = useAsrTrader();
const instrumentManager = useInstrument();
const formatter = appManager.formatter;
const instrument: Ref<InstrumentCache | null> = ref(null);
const change = computed(() => (price: number) => {
  if (instrument.value && price) {
    return ((price - instrument.value.last) / price) * 100;
  }
  return 0;
});
const totalBuy = ref(0);
const totalSell = ref(0);
const totalQueue = computed(() => totalBuy.value + totalSell.value);
const queue: Array<OrderQueueItem> = reactive([
  new OrderQueueItem(),
  new OrderQueueItem(),
  new OrderQueueItem(),
  new OrderQueueItem(),
  new OrderQueueItem(),
]);
instrumentManager
  .getInstrumentsDetail(new InstrumentSearchModel([props.insId]))
  .then((res) => {
    instrument.value = res[0];
  });
instrumentManager.getOrderQueue(props.insId).then((result) => {
  if (result.queue) {
    queue.splice(0, queue.length);
    result.queue.forEach((item) => {
      queue.push(item);
      totalBuy.value += item.buy.count * item.buy.amount;
      totalSell.value += item.sell.count * item.sell.amount;
    });
    for (let i = 5 - queue.length; i > 0; i--) {
      queue.push(new OrderQueueItem());
    }
  }
});

defineExpose({
  formatter,
  change,
  queue,
  totalBuy,
  totalSell,
  totalQueue,
});
</script>

<style lang="postcss" scoped>
.order-queue {
  > header {
    @apply tw-grid tw-grid-cols-6 tw-text-center;
    height: var(--tabel-row-height);
    line-height: var(--tabel-row-height);
    > div {
      font-size: 0.75rem !important;
      font-weight: 700;
      max-height: var(--tabel-row-height);
    }
    .sell {
      background-color: #efeff1;
    }
    .buy {
      background-color: #e0e0e0;
    }
  }
  .queue {
    @apply tw-grid tw-grid-cols-6;
    position: relative;
    > div {
      height: 31px;
      line-height: var(--tabel-row-height);
    }
    > .field {
      @apply tw-text-center;
      position: relative;
    }
  }
}
</style>
<template>
  <div class="order-queue" fluid>
    <header>
      <div class="buy">
        {{ $t("oms.count") }}
      </div>
      <div class="buy">
        {{ $t("oms.amount") }}
      </div>
      <div class="buy">
        {{ $t("oms.buy") }}
      </div>
      <div class="sell">
        {{ $t("oms.sell") }}
      </div>
      <div class="sell">
        {{ $t("oms.amount") }}
      </div>
      <div class="sell">
        {{ $t("oms.count") }}
      </div>
    </header>
    <div class="queue col-border" v-for="(item, index) in queue" :key="index" dense>
      <double-bar-chart
        :left="totalSell ? (item.sell.count * item.sell.amount * 100) / totalSell : 0"
        :right="totalBuy ? (item.buy.count * item.buy.amount * 100) / totalBuy : 0"
      />
      <div
        class="copy-cursor field"
        @click="
          () => {
            $emit('count', item.buy.count);
          }
        "
      >
        <numeric-field v-model="item.buy.count"></numeric-field>
      </div>
      <div class="field">
        <numeric-field v-model="item.buy.amount"></numeric-field>
      </div>
      <div
        class="copy-cursor field"
        @click="
          () => {
            $emit('price', item.buy.price);
          }
        "
      >
        <numeric-field v-model="item.buy.price">
          <!-- <span
            :class="[change(item.sell.price) < 0 ? 'error--text' : 'success--text']"
            style="font-size: 7px !important"
          >
            (%{{ formatter.format(change(item.buy.price)) }})
          </span> -->
        </numeric-field>
        <bar />
      </div>
      <div
        class="copy-cursor field"
        @click="
          () => {
            $emit('price', item.sell.price);
          }
        "
      >
        <numeric-field v-model="item.sell.price">
          <!-- <span
            :class="[change(item.sell.price) < 0 ? 'error--text' : 'success--text']"
            style="font-size: 7px !important"
          >
            (%{{ formatter.format(change(item.buy.price)) }})
          </span> -->
        </numeric-field>
      </div>
      <div class="field">
        <numeric-field v-model="item.sell.amount"></numeric-field>
      </div>
      <div
        class="copy-cursor field"
        @click="
          () => {
            $emit('count', item.sell.count);
          }
        "
      >
        <numeric-field v-model="item.sell.count"></numeric-field>
      </div>
    </div>
  </div>
</template>
