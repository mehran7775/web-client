<script setup lang="ts">
import { watch, ref, computed } from "vue";
import { useAsrTrader } from "@/composables";
const props = withDefaults(
  defineProps<{
    modelValue?: number;
    dir?: "ltr" | "rtl";
    min?: number;
    max?: number;
  }>(),
  {
    modelValue: 0,
    dir: "ltr",
    min: 0,
    max: 100,
  }
);
const emit = defineEmits(["update:modelValue"]);
const app = useAsrTrader();
const fromatter = computed(() => app.percentFormatter);
const val = ref(Math.max(props.min, props.modelValue));
const tooltipPos = computed(
  () => Math.floor((val.value - props.min) * 100) / (props.max - props.min + 8)
);
const process = computed(
  () => Math.floor((val.value - props.min) * 100) / (props.max - props.min)
);
const dataChanged = ref(false);

let timeout: number | null = null;
watch(
  () => props.modelValue,
  (update) => {
    val.value = update;
    dataChanged.value = true;
    if (timeout != null) clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      dataChanged.value = false;
    }, 750);
  }
);

const setValue = (e)=> {
  emit('update:modelValue', e.target.value)
}
</script>

<style lang="postcss" scoped>
.range-container {
  @apply tw-flex tw-relative;
  min-width: 47%;
  margin-right: 3%;
  .tooltip {
    border-radius: var(--border-radius-root);
    transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    position: absolute;
    top: -18px;
    display: block;
    opacity: 0;
    height: 24px;
    min-width: 24px;
    padding: 0 3px 0 3px;
    line-height: 24px;
    text-align: center;
    white-space: nowrap; 
    color: white;
    @apply tw-bg-primary;
  }
  &:hover,
  .update {
    .tooltip {
      opacity: 1 !important;
    }
  }
  .range {
    @apply tw-flex tw-flex-grow tw-bg-primary tw-bg-opacity-10 tw-rounded;
    appearance: none;
    cursor: pointer;
    height: 6px;
    margin: auto 0 auto 0;

    &::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      @apply tw-bg-primary;
    }
    &::-moz-range-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 0;
      @apply tw-bg-primary;
    }
  }
  .process {
    position: absolute;
    height: 6px;
    border-radius: 3px;
    top: calc(50% - 3px);
    pointer-events: none;
    @apply tw-bg-primary;
  }
}
</style>

<template>
  <div class="range-container">
    <div
      class="tooltip"
      :style="{ left: tooltipPos + '%', opacity: dataChanged ? 1 : 0 }"
    >
      {{ fromatter.format(val / 100) }}
    </div>
    <input
      class="range"
      :dir="dir"
      type="range"
      :value="val"
      :min="min"
      :max="max"
      @input="setValue"
      v-bind="$attrs"
    />
    <div class="process" :style="{ width: process + '%' }"></div>
  </div>
</template>
