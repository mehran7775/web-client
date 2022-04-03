<template>
  <v-container class="text-center legal-real ma-0 pa-0" fluid>
    <v-row v-if="!hideHeaders" dense>
      <v-col class="success--text">
        {{ $t("oms.buy") }}
      </v-col>
      <v-col class="error--text">
        {{ $t("oms.sell") }}
      </v-col>
    </v-row>
    <v-row v-show="!hideHeaders" class="text-no-wrap" dense>
      <v-col
        :class="{
          'd-none d-md-block': responsive,
        }"
        >{{ $t("oms.count") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
        }"
        >{{ $t("oms.amount") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
        }"
        >{{ $t("oms.percent") }}</v-col
      >
      <v-col v-if="responsive" class="d-md-none">{{ $t("oms.count-short") }}</v-col>
      <v-col v-if="responsive" class="d-md-none">{{ $t("oms.amount-short") }}</v-col>
      <v-col v-if="responsive" class="d-md-none">{{ $t("oms.percent-short") }}</v-col>

      <v-col></v-col>

      <v-col
        :class="{
          'd-none d-md-block': responsive,
        }"
        >{{ $t("oms.count") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
        }"
        >{{ $t("oms.amount") }}</v-col
      >
      <v-col
        :class="{
          'd-none d-md-block': responsive,
        }"
        >{{ $t("oms.percent") }}</v-col
      >
      <v-col v-if="responsive" class="d-md-none">{{ $t("oms.count-short") }}</v-col>
      <v-col v-if="responsive" class="d-md-none">{{ $t("oms.amount-short") }}</v-col>
      <v-col v-if="responsive" class="d-md-none">{{ $t("oms.percent-short") }}</v-col>
    </v-row>
    <v-row dense>
      <v-col class="col-border">
        <numeric-field :value="distribution.real.buy.count" />
      </v-col>
      <v-col class="col-border">
        <numeric-field :value="distribution.real.buy.amount" />
      </v-col>
      <v-col class="col-border">
        <percent-field
          :value="(distribution.real.buy.count * distribution.real.buy.amount) / total"
        />
      </v-col>
      <v-col class="col-border real">{{ $t("user.personality.real") }}</v-col>
      <v-col class="col-border">
        <numeric-field :value="distribution.real.sell.count" />
      </v-col>
      <v-col class="col-border">
        <numeric-field :value="distribution.real.sell.amount" />
      </v-col>
      <v-col class="col-border">
        <percent-field
          :value="(distribution.real.sell.count / total) * distribution.real.sell.amount"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col class="col-border">
        <numeric-field :value="distribution.legal.buy.count" />
      </v-col>
      <v-col class="col-border">
        <numeric-field :value="distribution.legal.buy.amount" />
      </v-col>
      <v-col class="col-border">
        <percent-field
          :value="(distribution.legal.buy.count * distribution.legal.buy.amount) / total"
        />
      </v-col>
      <v-col class="col-border legal">{{ $t("user.personality.real") }}</v-col>
      <v-col class="col-border">
        <numeric-field :value="distribution.legal.sell.count" />
      </v-col>
      <v-col class="col-border">
        <numeric-field :value="distribution.legal.sell.amount" />
      </v-col>
      <v-col class="col-border">
        <percent-field
          :value="
            (distribution.legal.sell.count / total) * distribution.legal.sell.amount
          "
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "#app";
import { ClientDistribution } from "@/types";
import { useInstrument } from "~/composables";
import numericField from "../numericField.vue";
import PercentField from "../percentField.vue";

export default defineComponent({
  components: { numericField, PercentField },
  name: "legal-real-card",
  props: {
    insId: { type: Number, required: true },
    hideHeaders: Boolean,
    responsive: Boolean,
  },
  setup(props) {
    const instrumentManager = useInstrument();
    const distribution: Ref<ClientDistribution> = ref(new ClientDistribution());
    const total = ref(1);
    instrumentManager.getClientDistribution(props.insId).then((result) => {
      if (result) {
        distribution.value = result;
        total.value =
          result.real.buy.count * result.real.buy.amount +
          result.real.sell.count * result.real.sell.amount +
          result.legal.buy.count * result.legal.buy.amount +
          result.legal.sell.count * result.legal.sell.amount;
        total.value = total.value == 0 ? 1 : total.value;
      }
    });
    return {
      distribution,
      total,
    };
  },
});
</script>
<style lang="postcss">
.legal-real {
  .col {
    background-color: rgba(var(--c-default), 0.05);
  }
}
</style>
<style lang="postcss" scoped>
.real {
  color: var(--c-info-rgb);
  background-color: rgba(var(--c-info), 0.1);
}
.legal {
  color: var(--c-info-rgb);
  background-color: rgba(var(--c-info), 0.1);
}
</style>
