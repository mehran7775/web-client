<script setup lang="ts">
import { reactive, ref, computed, Ref } from "#app";
import { Instrument, InstrumentCache, InstrumentSearchModel, OrderQueueItem } from "@/types";
import { useAsrTrader, useInstrument } from "~/composables";
import doubleBarChart from "../doubleBarChart.vue";

const emit = defineEmits(["count", "price"]);
const props = withDefaults(
  defineProps<{
    inst: Instrument | InstrumentCache;
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
const totalBuy = computed(() => {
  let tmp = 0;
  queue.value.forEach((item) => {
    tmp += item.buy.count * item.buy.amount;
  });
  return tmp;
});
const totalSell = computed(() => {
  let tmp = 0;
  queue.value.forEach((item) => {
    tmp += item.sell.count * item.sell.amount;
  });
  return tmp;
});
const totalQueue = computed(() => totalBuy.value + totalSell.value);

//TODO Replace in vue 3
const queue = ref<OrderQueueItem[]>(instrumentManager.getOrderQueue(props.inst));// computed(() => instrumentManager.getOrderQueue(props.inst));
setInterval(() => {
  queue.value = instrumentManager.getOrderQueue(props.inst)
}, 700)


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
  >header {
    @apply tw-grid tw-grid-cols-6 tw-text-center;
    height: var(--row-height);
    line-height: var(--row-height);

    >div {
      font-size: 0.75rem !important;
      font-weight: 700;
      max-height: var(--row-height);
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

    >div {
      height: 31px;
      line-height: var(--row-height);
    }

    >.field {
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
    <div class="queue col-border" v-for="(item, index) in queue"
      :key="item.sell.price + '-' + item.buy.price + '-' + index">
      <double-bar-chart :left="totalSell ? (item.sell.count * item.sell.amount * 100) / totalSell : 0"
        :right="totalBuy ? (item.buy.count * item.buy.amount * 100) / totalBuy : 0" />
      <div class="copy-cursor field" @click="
        () => {
          $emit('count', item.buy.count);
        }
      ">
        <numeric-field v-model="item.buy.count"></numeric-field>
      </div>
      <div class="field">
        <numeric-field v-model="item.buy.amount"></numeric-field>
      </div>
      <div class="copy-cursor field" @click="
        () => {
          $emit('price', item.buy.price);
        }
      ">
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
      <div class="copy-cursor field" @click="
        () => {
          $emit('price', item.sell.price);
        }
      ">
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
      <div class="copy-cursor field" @click="
        () => {
          $emit('count', item.sell.count);
        }
      ">
        <numeric-field v-model="item.sell.count"></numeric-field>
      </div>
    </div>
  </div>
</template>
