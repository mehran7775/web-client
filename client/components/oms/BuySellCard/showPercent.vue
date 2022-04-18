<script setup lang="ts">
import { ref, watch, computed } from "#app";
import NumericField from "~~/components/numericField.vue";
const props = defineProps<{
  value: number;
}>();
const emit = defineEmits(["input"]);
const val = ref(100);
const total = ref(props.value);
const res = computed(() => Math.floor(total.value * (val.value / 100)));
watch(
  () => props.value,
  (update) => {
    total.value = update;
  }
);
</script>
<style lang="postcss" scoped>
.view {
  line-height: 16px !important;
}
</style>
<template>
  <text-input
    :label="$t('oms.view-count')"
    type="number"
    v-model="val"
    @input="
      () => {
        emit('input', val);
      }
    "
    class="tw-mt-1"
    min="30"
    max="100"
  >
    <template #append>
      <NumericField :value="res" class="tw-px-0 tw-my-[4px] tw-w-[25%] view" />
    </template>
  </text-input>
</template>
