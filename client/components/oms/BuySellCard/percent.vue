<script setup lang="ts">
import { computed, ref, watch } from "#app";
import { useAsrTrader } from "@/composables";

const props = withDefaults(
  defineProps<{
    height: string;
    value: number;
    min: number;
    max: number;
  }>(),
  {
    value: 0,
    min: 0,
    max: 100,
  }
);

const emit = defineEmits(["input"]);

const formatter = useAsrTrader().percentFormatter;
const width = computed(() => {
  return (val.value * 203) / 100 + Math.floor(val.value / 10) * 2.5;
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
function setVal(value: number) {
  val.value = value * 10;
}
</script>

<template>
  <div class="percent-container">
    <div class="percent" :style="{ height: height }">
      <span
        v-for="(i, index) in 10"
        :key="index"
        @click="() => setVal(index + 1)"
        class="point"
      >
      </span>
      <div class="tooltip-container" :style="{ height: height, width: width + 'px' }">
        <span class="tooltip">
          {{ formatter.format(val / 100) }}
        </span>
      </div>
      <div class="selected" :style="{ width: width + 'px' }">
        <span
          v-for="(i, index) in 10"
          :key="index"
          @click="() => setVal(index + 1)"
          class="point"
        >
        </span>
      </div>
    </div>
    <TextInput
      class="tw-flex-grow tw-mt-1"
      dir="rtl"
      type="number"
      label="درصد سهم"
      :value="val"
      @input="setValue"
      :min="min"
      :max="max"
    ></TextInput>
  </div>
</template>

<style scoped lang="postcss">
.percent-container {
  @apply tw-w-full tw-max-w-full;
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
