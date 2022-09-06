<script setup lang="ts">
import {
  Tabs,
  DeepOptions,
  Instrument,
  SameSectorQuery,
  InstrumentCache,
  Side,
} from "@/types";
import { useInstrument } from "~/composables";
import LastPrice from "@/components/oms/lastPrice.vue";

const bottomPanel = useBottomPanel();
const instrumentManager = useInstrument();
const instruments = computed(()=> instrumentManager.getFocus)
const count = ref(0);
const price = ref(0);
const tab = computed({
  get: () => {
    return instrumentManager.getActive;
  },
  set: (val) => {
    instrumentManager.activateTab(val);
  },
});
const selected = computed(() => instrumentManager.state.selected);
function select(val: InstrumentCache) {
  const crt = instrumentManager.state.selected;
  if (crt == null || crt.id != val.id) instrumentManager.select(val);
  else instrumentManager.select(null);
}
function close(id: number) {
  instrumentManager.removeFocus(id);
}
async function deep(option: DeepOptions, instrument: Instrument) {
  bottomPanel.setDepthData(null);
  switch (option) {
    case DeepOptions.teammates:
      try {
        bottomPanel.setLoading(true);
        await bottomPanel.getTeammates(
          new SameSectorQuery(instrument.id, instrument.sector)
        );
      } finally {
        bottomPanel.setLoading(false);
      }
      break;
    default:
      //TODO Notifs
      //bottomPanel.setTitle({ tab: Tabs.depth, title: "oms." + option, params: [] });
      break;
  }
  //TODO Notif action
  //bottomPanel.setActiveTab(Tabs.depth);
}

defineExpose({
  close,
  deep,
  select,
  LastPrice,
  price,
  count,
  tab,
  instruments,
  deepOptions: DeepOptions,
});
</script>

<style lang="postcss" scoped>
.tab-view {
  @apply tw-w-full;
  > .toggle {
    @apply tw-justify-start tw-w-full tw-items-end tw-bg-gray4 tw-bg-opacity-20 tw-border-b tw-border-primary tw-border-opacity-10;
    box-shadow: 0 0 1px 0 #e2e2e2;
    min-height: 32px;

    .tab {
      @apply tw-px-2 tw-flex tw-items-center tw-justify-between tw-bg-transparent;
      min-width: 168px;
      border-radius: 0 !important;

      &.selected {
        @apply tw-bg-primary tw-bg-opacity-20;
        &::after {
          background-color: transparent;
        }
      }
      &::after {
        border-radius: 0 !important;
      }

      .ada-badge {
        span {
          @apply tw-text-error;
        }
        & :deep(.badge) {
          @apply tw-bg-success;
        }
      }
    }
  }

  > .tabs {
    min-height: calc(320px - 32px);

    .detail {
      @apply tw-flex tw-flex-grow tw-justify-between;

      &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: white;
        z-index: -1;
      }

      .panel {
        border-left: 1px solid #e0e0e0;
        border-right: 1px solid #e0e0e0;
        width: calc(33% - 2px);
      }
    }
  }
}
</style>

<template>
  <div class="tab-view">
    <ada-toggle :height="32" v-model="tab" align-with-title>
      <ada-btn
        @click="() => select(item)"
        v-for="(item, i) in instruments"
        :key="item.id"
        :model="item"
        name-key="$.id"
        :height="32"
        class="tab"
        :class="{ selected: selected && selected.id == item.id }"
      >
        <ada-badge dot left offset-y="75%" offset-x="-5">
          {{ item.name }}
          <last-price :value="item" />
        </ada-badge>
        <ada-icon @click.stop="() => close(item.id)" :size="12">
          mdi-close
        </ada-icon>
        <div v-if="i != instruments.length - 1" class="bar"></div>
      </ada-btn>
    </ada-toggle>
    <ada-tabs v-model="tab">
      <ada-tab
        class="detail"
        v-for="item in instruments"
        :key="item.id"
        :model="item"
      >
        <div class="panel">
          <oms-order-queue-card
            :inst="item"
            @count="
              (val) => {
                count = val;
              }
            "
            @price="
              (val) => {
                price = val;
              }
            "
            copy
            responsive
          />
          <oms-legal-real-card :insId="item.id" hide-headers responsive />
          <ada-col class="col-border tw-align-middle tw-justify-center">
            <ada-icon size="16"> isax-presention-chart </ada-icon>
          </ada-col>
        </div>
        <div class="panel">
          <oms-buy-sell-card
            :price.sync="price"
            :count.sync="count"
            :insId="item.id"
            :insName="item.name"
          />
        </div>
        <div class="panel">
          <oms-instrument-card
            :insId="item.id"
            :insName="item.name"
            @count="
              (val) => {
                count = val;
              }
            "
            @price="
              (val) => {
                price = val;
              }
            "
            responsive
          />
        </div>
      </ada-tab>
    </ada-tabs>
  </div>
</template>
