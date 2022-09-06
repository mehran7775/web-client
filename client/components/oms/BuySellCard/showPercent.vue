<script setup lang="ts">
import NumericField from "~~/components/numericField.vue";
const props = defineProps<{
  modelValue: number;
}>();
const emit = defineEmits(["update:modelValue"]);
const val = ref(100);
const total = ref(props.modelValue);
const res = computed(() => Math.ceil(total.value * (val.value / 100)));
watch(
  () => props.modelValue,
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
  <ada-input
    :label="$t('oms.view-count')"
    type="number"
    v-model:value="val"
    @input="
      () => {
        emit('update:modelValue', val);
      }
    "
    class="tw-mt-1"
    :min="30"
    :max="100"
  >
    <template #append>
      <NumericField :value="res" class="tw-px-0 tw-my-[4px] tw-min-w-[25%] view" />
    </template>
  </ada-input>
</template>
