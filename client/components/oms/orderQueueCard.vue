<template>
  <v-container class="text-center ma-0 pa-0" fluid>
    <v-row dense v-if="responsive" class="d-md-none headers">
      <v-col class="success--text">
        {{ $t("oms.buy") }}
      </v-col>
      <v-col class="error--text">
        {{ $t("oms.sell") }}
      </v-col>
    </v-row>
    <v-row class="text-no-wrap headers" dense>
      <v-col
        :class="{
          'd-none d-md-block': responsive,
          buy: true,
        }"
        >{{ $t("oms.count") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
          buy: true,
        }"
        >{{ $t("oms.amount") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
          buy: true,
        }"
        >{{ $t("oms.buy") }}</v-col
      >
      <v-col v-if="responsive" class="d-md-none buy">{{ $t("oms.count-short") }}</v-col>
      <v-col v-if="responsive" class="d-md-none buy">{{ $t("oms.amount-short") }}</v-col>
      <v-col v-if="responsive" class="d-md-none buy">{{ $t("oms.price-short") }}</v-col>
      <v-col
        :class="{
          'd-none d-md-block': responsive,
          sell: true,
        }"
        >{{ $t("oms.sell") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
          sell: true,
        }"
        >{{ $t("oms.amount") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
          sell: true,
        }"
        >{{ $t("oms.count") }}</v-col
      >
      <v-col v-if="responsive" class="d-md-none sell">{{ $t("oms.price-short") }}</v-col>
      <v-col v-if="responsive" class="d-md-none sell">{{ $t("oms.amount-short") }}</v-col>
      <v-col v-if="responsive" class="d-md-none sell">{{ $t("oms.count-short") }}</v-col>
    </v-row>
    <v-row class="queue" v-for="(item, index) in queue" :key="index" dense>
      <double-bar-chart
        :left="totalSell ? (item.sell.count * item.sell.amount * 100) / totalSell : 0"
        :right="totalBuy ? (item.buy.count * item.buy.amount * 100) / totalBuy : 0"
      />
      <v-col
        :class="{ 'copy-cursor': copy, 'col-border': true }"
        @click="
          () => {
            $emit('count', item.buy.count);
          }
        "
      >
        <numeric-field v-model="item.buy.count"></numeric-field>
      </v-col>
      <v-col class="col-border">
        <numeric-field v-model="item.buy.amount"></numeric-field>
      </v-col>
      <v-col
        :class="{ 'copy-cursor': copy, 'col-border': true }"
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
      </v-col>
      <v-col
        :class="{ 'copy-cursor': copy, 'col-border': true }"
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
      </v-col>
      <v-col class="col-border">
        <numeric-field v-model="item.sell.amount"></numeric-field>
      </v-col>
      <v-col
        :class="{ 'copy-cursor': copy, 'col-border': true }"
        @click="
          () => {
            $emit('count', item.sell.count);
          }
        "
      >
        <numeric-field v-model="item.sell.count"></numeric-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  useStore,
  reactive,
  ref,
  computed,
  Ref,
} from "@nuxtjs/composition-api";
import { InstrumentCache, InstrumentSearchModel, OrderQueueItem } from "@/types";
import { useAsrTrader, useInstrument } from "~/composables";
import doubleBarChart from "../doubleBarChart.vue";

export default defineComponent({
  components: { doubleBarChart },
  name: "order-queue-card",
  emits: ["count", "price"],
  props: {
    insId: { type: Number, required: true },
    copy: Boolean,
    responsive: Boolean,
    "extra-col": Boolean,
  },
  setup(props) {
    const store = useStore();
    const appManager = useAsrTrader(store);
    const instrumentManager = useInstrument(store);
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

    return {
      formatter,
      change,
      queue,
      totalBuy,
      totalSell,
      totalQueue,
    };
  },
});
</script>

<style lang="scss" scoped>
.headers {
  .col {
    font-size: 0.75rem !important;
    font-weight: 700;
    max-height: 32px;
  }
  .sell {
    background-color: #efeff1;
  }
  .buy {
    background-color: #e0e0e0;
  }
}
.queue {
  position: relative;
  max-height: 32px;
}
</style>
