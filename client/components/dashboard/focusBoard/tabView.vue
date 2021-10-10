<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-tabs color="blue" v-model="tab" align-with-title>
          <v-tab v-for="item in instruments" :key="item.id" class="pe-1 ps-2">
            {{ item.name }}
            <v-spacer />
            <v-icon @click="() => close(item.id)" small> mdi-close </v-icon>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item v-for="item in instruments" :key="item.id">
            <v-row>
              <v-col cols="4">
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
                <legal-real-card extra-col hide-headers responsive/>
              </v-col>
              <v-col cols="4">
                <instrument-card :insId="item.id"/>
              </v-col>
              <v-col cols="4">
                <buy-sell-card :price.sync="price" :count.sync="count" />
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
import { ActiveInstrument, OrderSide } from "@/types/oms";
import instrumentCard from "@/components/oms/instrumentCard.vue";
import OrderQueueCard from "@/components/oms/orderQueueCard.vue";
import LegalRealCard from "@/components/oms/legalRealCard.vue";
import BuySellCard from "~/components/oms/BuySellCard.vue";

export default defineComponent({
  components: {
    instrumentCard,
    OrderQueueCard,
    LegalRealCard,
    BuySellCard,
  },
  setup() {
    const store = useStore();
    const instruments = computed(() => store.getters["instruments/getFocus"]);
    const count: Ref<number> = ref(0);
    const price: Ref<number> = ref(0);
    const tab = computed({
      get() {
        return (
          (store.getters["instruments/getSelected"] as ActiveInstrument)
            ?.focusIndex | 0
        );
      },
      set(value: number) {
        store.commit(
          "instruments/select",
          new ActiveInstrument(
            value,
            (store.getters["instruments/getSelected"] as ActiveInstrument)
              ?.side | OrderSide.Buy
          )
        );
      },
    });
    function close(id: number) {
      store.commit("instruments/removeFocus", id);
      store.commit("instruments/stopWatchQueue", id);
    }
    return {
      close,
      price,
      count,
      tab,
      instruments,
    };
  },
});
</script>

