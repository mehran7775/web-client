<template>
  <v-container fluid>
    <v-row dense>
      <v-col>
        <v-tabs color="blue" v-model="tab" align-with-title>
          <v-tab v-for="item in instruments" :key="item.id" class="pe-1 ps-5">
            <v-badge color="success" dot left offset-y="75%" offset-x="-5">
              {{ item.name }}{{ item.id }}
            </v-badge>
            <v-spacer />
            <v-icon @click="() => close(item.id)" small> mdi-close </v-icon>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item v-for="item in instruments" :key="item.id">
            <v-row dense>
              <v-col cols="4" class="ma-0 px-0">
                <order-queue-card
                  :insId="item.id"
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
                  extra-col
                  responsive
                />
                <legal-real-card extra-col hide-headers responsive />
              </v-col>
              <v-col cols="4" class="ma-0 px-0">
                <instrument-card
                  :insId="item.id"
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
              </v-col>
              <v-col cols="4" class="ma-0 px-0">
                <buy-sell-card :price.sync="price" :count.sync="count" />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <v-btn-toggle>
                  <v-btn
                    v-for="op in deepOptions"
                    :key="op"
                    @click="deep(op, item)"
                    small
                    >{{ $t("oms." + op) }}</v-btn
                  >
                </v-btn-toggle>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  useStore,
  computed,
  ref,
  Ref,
} from "@nuxtjs/composition-api";
import {
  ActiveInstrument,
  OrderSide,
  Tabs,
  DeepOptions,
  TabTitle,
  Instrument,
} from "@/types";
import instrumentCard from "@/components/oms/instrumentCard.vue";
import OrderQueueCard from "@/components/oms/orderQueueCard.vue";
import LegalRealCard from "@/components/oms/legalRealCard.vue";
import BuySellCard from "@/components/oms/BuySellCard.vue";

export default defineComponent({
  components: {
    instrumentCard,
    OrderQueueCard,
    LegalRealCard,
    BuySellCard,
  },
  setup(props, context) {
    const store = useStore();
    const i18n = useI18n();
    const instruments = computed(() => store.getters["instruments/getFocus"]);
    const count: Ref<number> = ref(0);
    const price: Ref<number> = ref(0);
    const tab = computed({
      get() {
        return store.getters["instruments/getSelectedIndex"] as number;
      },
      set(value: number | undefined) {
        store.commit("instruments/selectByIndex", value ?? 0);
      },
    });
    function close(id: number) {
      store.commit("instruments/removeFocus", id);
      store.commit("instruments/stopWatchQueue", id);
    }
    function deep(option: DeepOptions, instrument: Instrument) {
      switch (option) {
        case DeepOptions.teammates:
          store.dispatch("bottom-panel/getTeammates", {
            instrument: instrument.id,
            sector: instrument.sectorCode,
          });
          break;
        default:
          store.commit(
            "bottom-panel/setTitle",
            new TabTitle(Tabs.depth, "oms." + option)
          );
          break;
      }
      store.commit("bottom-panel/setActiveTab", Tabs.depth);
    }
    return {
      close,
      deep,
      price,
      count,
      tab,
      instruments,
      deepOptions: DeepOptions,
    };
    //TODO remove in vue 3
    function useI18n() {
      return context.root.$i18n;
    }
  },
});
</script>

