<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-row dense>
      <v-col>
        <v-tabs :height="40" color="primary" v-model="tab" align-with-title>
          <v-tab
            v-for="item in instruments"
            :key="item.id"
            :href="'#' + item.id"
            class="pe-1 ps-5"
          >
            <v-badge color="success" dot left offset-y="75%" offset-x="-5">
              {{ item.name }}
            </v-badge>
            <v-spacer />
            <v-icon @click="() => close(item.id)" small> mdi-close </v-icon>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item
            v-for="item in instruments"
            :key="item.id"
            :value="item.id.toString()"
          >
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
  Tabs,
  DeepOptions,
  TabTitle,
  Instrument,
  SameSectorQuery,
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
    const instruments = computed(
      () => store.getters["oms/instruments/getFocus"]
    );
    const count: Ref<number> = ref(0);
    const price: Ref<number> = ref(0);
    const tab = computed({
      get() {
        return (
          store.getters["oms/instruments/getSelectedId"] as number
        ).toString();
      },
      set(value: string | undefined) {
        store.commit("oms/instruments/selectById", value ? parseInt(value) : 0);
      },
    });
    function close(id: number) {
      store.commit("oms/instruments/removeFocus", id);
      store.commit("oms/instruments/stopWatchQueue", id);
    }
    async function deep(option: DeepOptions, instrument: Instrument) {
      store.commit("bottom-panel/setDepthData", null);
      switch (option) {
        case DeepOptions.teammates:
          try {
            store.commit("bottom-panel/setLoading", true);
            await store.dispatch(
              "bottom-panel/getTeammates",
              new SameSectorQuery(instrument.id, instrument.sectorCode)
            );
          } finally {
            store.commit("bottom-panel/setLoading", false);
          }
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

