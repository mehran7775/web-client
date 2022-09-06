<script setup lang="ts">
import { Side, InstrumentCache } from "@/types";
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
  instrumentManager.addFocus(item);
  instrumentManager.activateTab(item);
  instrumentManager.select(item);
  instrumentManager.setFocusMode(0);

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
      @apply tw-border tw-border-l-primary tw-border-r-primary;

      .toolbar {
        @apply tw-bg-primary tw-bg-opacity-10;
      }
    }

    .toolbar {
      @apply tw-flex tw-flex-grow tw-whitespace-nowrap tw-items-center tw-justify-between tw-bg-primary tw-bg-opacity-5;
      padding: 0 8px;
      height: 32px;
      line-height: 32px;

      .actions {
        @apply tw-flex tw-items-center;
      }

      .title {
        font-weight: 700;
        font-size: 1rem !important;
        margin: 0 8px;
        @apply tw-text-primary;

        & :deep(.badge) {
          @apply tw-bg-success;
        }
      }
      .buy, .sell{
        @apply tw-w-[58px] tw-text-white tw-mx-1 tw-h-[26px];
      }
      .buy {
        @apply tw-bg-success tw-bg-opacity-70;
      }

      .sell {
        @apply tw-bg-error tw-bg-opacity-70;
      }

      .close {
        @apply tw-bg-primary tw-bg-opacity-10 tw-w-8 tw-h-8 tw-text-primary tw-mr-3;
        .icon {
          @apply tw-text-primary tw-mb-2;
        }
        &:hover {
          @apply tw-bg-primary tw-text-white;
          .icon {
            @apply tw-text-white;
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="card-row">
    <dashboard-focus-board-card @click="() => select(item)" class="card-view" :class="{ 'active': selected && selected.id == item.id }"
      :minWidth="maxwidthVal" v-for="item in instruments" :key="item.id">
      <header class="toolbar">
        <div class="tw-flex">
          <ada-badge class="title" :color="
          (item.status & 1) != 1
            ? 'error'
            : (item.status & 6) != 6
              ? 'warning'
              : 'success'
        " dot>
          {{ item.name }}
        </ada-badge>
          <span v-text="`(${ $t('instrument.state.' + item.status) })`"></span>
        </div>
       <div class="actions">
        <ada-btn depressed dark small class="buy"
          @click.stop="() => order(item, Side.Buy)">
          {{ $t("oms.buy") }}
        </ada-btn>
        <ada-btn depressed dark small class="sell"
          @click.stop="() => order(item, Side.Sell)">
          {{ $t("oms.sell") }}
        </ada-btn>
        <ada-btn @click.stop="() => close(item)" class="close" depressed small>
          <ada-icon :size="12"> mdi-close </ada-icon>
        </ada-btn>
       </div>
      </header>
      <div class="text-caption ma-0 px-0">
        <oms-order-queue-card :inst="item" />
        <oms-instrument-card :insId="item.id" hide-headers />
        <ada-col class="col-border tw-justify-center tw-align-middle">
          <ada-icon :size="16"> isax-presention-chart </ada-icon>
        </ada-col>
      </div>
    </dashboard-focus-board-card>
  </div>
</template>
