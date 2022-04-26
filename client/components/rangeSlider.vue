<script setup lang="ts">
import { watch, ref, computed } from "#app";
import { useAsrTrader } from "@/composables";
import { time } from "console";
const props = withDefaults(
  defineProps<{
    value: number;
    dir: "ltr" | "rtl";
    min: number;
    max: number;
  }>(),
  {
    value: 0,
    dir: "ltr",
    min: 0,
    max: 100,
  }
);
const emit = defineEmits(["input", "update:value"]);
const app = useAsrTrader();
const fromatter = computed(() => app.percentFormatter);
const val = ref(Math.max(props.min, props.value));
const tooltipPos = computed(
  () => Math.floor((val.value - props.min) * 100) / (props.max - props.min + 8)
);
const dataChanged = ref(false);
function setVal(data: Event) {
  emit("input", val.value);
  emit("update:value", val.value);
}
let timeout: number | null = null;
watch(
  () => props.value,
  (update) => {
    val.value = update;
    dataChanged.value = true;
    if (timeout != null) clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      dataChanged.value = false;
    }, 750);
  }
);
</script>

<style lang="postcss" scoped>
.range-container {
  position: relative;
  display: flex;
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
    background-color: var(--c-primary-rgb);
    color: white;
  }
  &:hover,
  .update {
    .tooltip {
      opacity: 1 !important;
    }
  }
  .range {
    @apply tw-flex tw-flex-grow;
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
      v-model="val"
      :min="min"
      :max="max"
      @input="setVal"
    />
  </div>
</template>
