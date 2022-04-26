<script setup lang="ts">
import { computed, ref, watch } from "#app";

const props = withDefaults(
  defineProps<{
    height: string;
    value: number;
    min: number;
    max: number;
    label: string;
    total: number;
  }>(),
  {
    value: 0,
    min: 0,
    max: 100,
    label: "Percent",
    total: 0,
  }
);

const emit = defineEmits(["input"]);

const minCount = computed(() => {
  if (props.total) return Math.floor((props.min / 100) * props.total);
  else return props.min;
});
const maxCount = computed(() => {
  if (props.total) return Math.floor((props.max / 100) * props.total);
  else return props.max;
});
const result = computed(() => {
  if (props.total) return Math.floor((val.value / 100) * props.total);
  else return val.value;
});

const val = ref(props.value);

watch(
  () => props.value,
  (update) => {
    setValue(update);
  }
);
function setValue(update: number | string) {
  if (typeof update == "string") update = parseInt(update);
  val.value = update > props.max ? props.max : update < props.min ? props.min : update;
  emit("input", val.value);
}
function toPercent(value: number) {
  if (props.total) val.value = (value / props.total) * 100;
  else val.value = value;
}
</script>

<template>
  <div class="percent-container">
    <RangeSlider :min="min" :max="max" :value="val" @input="setValue" />
    <TextInput
      class="tw-flex-grow tw-mt-1"
      dir="rtl"
      type="number"
      :label="label"
      :value="result"
      @input="toPercent"
      :min="minCount"
      :max="maxCount"
    ></TextInput>
  </div>
</template>

<style scoped lang="postcss">
.percent-container {
  @apply tw-grid tw-gap-8 tw-grid-cols-2;
  direction: ltr;
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
