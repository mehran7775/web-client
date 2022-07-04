<script setup lang="ts">
import { computed } from "#app";
import { Side, InstrumentCache } from "@/types";
import instrumentCard from "@/components/oms/instrumentCardCompact.vue";
import OrderQueueCard from "@/components/oms/orderQueueCard.vue";
import card from "./card.vue";
import { useInstrument, useOrder } from "~/composables";

const instrumentManager = useInstrument();
const orderManager = useOrder();

const instruments = computed(() => instrumentManager.getFocus);
const maxwidthVal = computed(
  () => {
    const cnt = Math.floor(instrumentManager.width / 362);
    return (instrumentManager.width - ((cnt - 1) * 12)) / cnt
  }
);

const selected = computed(() => instrumentManager.state.selected)

function close(item: InstrumentCache) {
  instrumentManager.removeFocus(item.id);
}
function order(item: InstrumentCache, side: Side) {
  orderManager.setSide(side, item.id.toString());
  instrumentManager.select(item);
  instrumentManager.setFocusMode(0);
  instrumentManager.focusOnCount(side)

}
function select(item: InstrumentCache) {
  instrumentManager.activateTab(item);
  const crt = instrumentManager.state.selected;
  if (crt == null || crt.id != item.id)
    instrumentManager.select(item);
  else
    instrumentManager.select(null);
}

defineExpose({
  instruments,
  maxwidthVal,
  selected,
  select,
  close,
  order
})

</script>

<style lang="postcss" scoped>
.card-row {
  @apply tw-w-full tw-grid tw-gap-y-0 tw-grid-rows-none tw-gap-x-4 tw-grid-flow-col;
  justify-content: flex-start;
  overflow-x: auto;
  overflow-y: hidden;
  height: 320px;

  >.card-view {
    position: relative;
    background-color: white;
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    cursor: pointer;

    &.active {
      border-left: 1px solid rgba(var(--c-selected-inst), 0.5);
      border-right: 1px solid rgba(var(--c-selected-inst), 0.5);

      .toolbar {
        background-color: rgba(var(--c-selected-inst), .4) !important;
      }
    }

    .toolbar {
      @apply tw-flex tw-flex-grow tw-whitespace-nowrap tw-items-center;
      padding: 0 8px;
      background-color: rgba(var(--c-primary), 0.05) !important;
      height: 32px;
      line-height: 32px;

      .title {
        font-weight: 700;
        font-size: 1rem !important;
        color: var(--c-primary-rgb);
        margin: 0 8px;
      }

      .buy {
        background-color: rgba(var(--c-success), 0.7) !important;
      }

      .sell {
        background-color: rgba(var(--c-error), 0.7) !important;
      }

      .close {
        background-color: rgba(var(--c-primary), 0.1) !important;
      }
    }
  }
}
</style>

<template>
  <div class="card-row">
    <card @click="() => select(item)" class="card-view" :class="{ 'active': selected && selected.id == item.id }"
      :minWidth="maxwidthVal" v-for="item in instruments" :key="item.id">
      <header class="toolbar">
        <ada-badge class="title" :color="
          (item.status & 1) != 1
            ? 'error'
            : (item.status & 6) != 6
              ? 'warning'
              : 'success'
        " dot>
          {{ item.name }}
        </ada-badge>
        ({{ $t("instrument.state." + item.status) }})
        <ada-spacer />
        <ada-btn depressed height="24px" width="56px" color="success" dark small class="ma-0 me-2 pa-0 buy"
          @click.stop="() => order(item, Side.Buy)">
          {{ $t("oms.buy") }}
        </ada-btn>
        <ada-btn depressed height="24px" width="56px" color="error" dark small class="me-3 pa-0 sell"
          @click.stop="() => order(item, Side.Sell)">
          {{ $t("oms.sell") }}
        </ada-btn>
        <ada-btn @click.stop="() => close(item)" height="24px" width="24px" class="close me-1" depressed small>
          <ada-icon color="primary" :size="12"> mdi-close </ada-icon>
        </ada-btn>
      </header>
      <div class="text-caption ma-0 px-0">
        <order-queue-card :inst="item" />
        <instrument-card :insId="item.id" hide-headers />
        <ada-col class="col-border tw-justify-center tw-align-middle">
          <ada-icon :size="16"> isax-presention-chart </ada-icon>
        </ada-col>
      </div>
    </card>
  </div>
</template>
