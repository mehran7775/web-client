<script setup lang="ts">
import { ref, Ref } from "#app";
import { ClientDistribution } from "@/types";
import { computed } from "@vue/reactivity";
import { useInstrument } from "~/composables";

const props = withDefaults(
  defineProps<{
    insId: number;
    hideHeaders: boolean;
    responsive: boolean;
  }>(),
  {
    hideHeaders: true,
    responsive: false,
  }
);
const instrumentManager = useInstrument();

//TODO Replace in Vue3
const distribution: Ref<ClientDistribution> = ref(instrumentManager.getClientDistribution(props.insId));
setInterval(() => {
  distribution.value = instrumentManager.getClientDistribution(props.insId)
}, 700)

const total = computed(() => {
  const result = distribution.value;
  const tmp = result.real.buy.count * result.real.buy.amount +
    result.real.sell.count * result.real.sell.amount +
    result.legal.buy.count * result.legal.buy.amount +
    result.legal.sell.count * result.legal.sell.amount;
  return tmp == 0 ? 1 : tmp;

});
</script>

<style lang="postcss" scoped>
.legal-real {
  @apply tw-grid tw-grid-cols-7;

  >div {
    @apply tw-text-center;
    background-color: rgba(var(--c-default), 0.05);
    height: 32px;
    line-height: 32px;
  }

  .real {
    color: var(--c-info-rgb);
    background-color: rgba(var(--c-info), 0.1);
  }

  .legal {
    color: var(--c-info-rgb);
    background-color: rgba(var(--c-info), 0.1);
  }
}
</style>

<template>
  <div class="legal-real">
    <div class="col-border">
      <numeric-field :value="distribution.real.buy.count" />
    </div>
    <div class="col-border">
      <numeric-field :value="distribution.real.buy.amount" />
    </div>
    <div class="col-border">
      <PercentField :value="(distribution.real.buy.count * distribution.real.buy.amount) / total" />
    </div>
    <div class="col-border real">{{ $t("user.personality.real") }}</div>
    <div class="col-border">
      <numeric-field :value="distribution.real.sell.count" />
    </div>
    <div class="col-border">
      <numeric-field :value="distribution.real.sell.amount" />
    </div>
    <div class="col-border">
      <percent-field :value="(distribution.real.sell.count / total) * distribution.real.sell.amount" />
    </div>

    <div class="col-border">
      <numeric-field :value="distribution.legal.buy.count" />
    </div>
    <div class="col-border">
      <numeric-field :value="distribution.legal.buy.amount" />
    </div>
    <div class="col-border">
      <percent-field :value="(distribution.legal.buy.count * distribution.legal.buy.amount) / total" />
    </div>
    <div class="col-border legal">{{ $t("user.personality.legal") }}</div>
    <div class="col-border">
      <numeric-field :value="distribution.legal.sell.count" />
    </div>
    <div class="col-border">
      <numeric-field :value="distribution.legal.sell.amount" />
    </div>
    <div class="col-border">
      <percent-field :value="(distribution.legal.sell.count / total) * distribution.legal.sell.amount" />
    </div>
  </div>
</template>
