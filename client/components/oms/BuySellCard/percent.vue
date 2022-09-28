<script setup lang="ts">

const props = withDefaults(
  defineProps<{
    modelValue: number
    height?: string;
    amount?: number;
    min?: number;
    max?: number;
    label?: string;
    total?: number;
  }>(),
  {
    modelValue: 30,
    height:'42px',
    amount: 1,
    min: 1,
    max: 100,
    label: "Percent",
    total: 0,
  }
);

const emit = defineEmits(["update:modelValue","count"]);
const val = ref(props.amount);

const minCount = computed(() => {
  if (props.total) return Math.ceil((props.min / 100) * props.total);
  else return props.min;
});
const maxCount = computed(() => {
  if (props.total) return Math.ceil((props.max / 100) * props.total);
  else return props.max;
});
const result = computed(() => {
  if (props.total)
    return Math.min(
      Math.max(Math.round((val.value / 100) * props.total), minCount.value),
      maxCount.value
    );
  else return 0;
});


watch(
  () => props.amount,
  (update) => {
    setValue(update);
  }
);
function setValue(update: number | string) {
  if (typeof update == "string") update = parseInt(update);
  val.value = update > props.max ? props.max : update < props.min ? props.min : update;
  emit("update:modelValue", val.value);
}
function toPercent(value: number) {
  if (props.total) val.value = (value / props.total) * 100;
  else val.value = value;
}
</script>

<template>
  <div class="percent-container">
    <RangeSlider :min="min" :max="max" v-model="val" @update="setValue" class="tw-max-w-full" v-bind="$attrs"/>
    <ada-currency-input
      dir="rtl"
      :label="label"
      :modelValue="result"
      @update:modelValue="toPercent"
      :min="minCount"
      :max="maxCount"
      readonly
      v-bind="$attrs"
    ></ada-currency-input>
  </div>
</template>

<style scoped lang="postcss">
.percent-container {
  @apply tw-justify-between;
  direction: ltr;

  .ada-input {
    & :deep(.scaffold) {
      max-width: calc(100% - 77px)!important;
      @apply tw-border-none;
    }
    &.active :deep(.scaffold) {
      @apply tw-bg-primary tw-bg-opacity-10;
    }
    /* & :deep(input) {
      @apply tw-pl-0 tw-ml-0;
    } */
  }
  .percent {
    @apply tw-relative;
    min-width: 233px;
    .tooltip-container {
      position: absolute;
      top: 0;
      left: 0;
      .tooltip {
        color: white;
        position: absolute;
        display: block;
        top: 0;
        right: -7px;
        width: 14px;
        height: 10px;
        line-height: 10px;
        border-radius: 2px;
        font-size: 6px;
        text-align: center;
        background-color: var(--c-primary-rgb);
      }
    }
    .selected {
      position: absolute;
      top: 0;
      white-space: nowrap;
      overflow: hidden;
      .point {
        background-color: var(--c-primary-rgb);
      }
    }
    .point {
      display: inline-block;
      width: 20px;
      height: 6px;
      margin: auto 3px auto 0;
      border-radius: 6px;
      content: "";
      background-color: var(--c-default-rgb);
      &:hover {
        background-color: rgba(var(--c-primary), 0.5);
      }
    }
  }
}
</style>
