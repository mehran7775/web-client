<script setup lang="ts">
import { computed, ref } from "#app";
import { useAsrTrader } from "@/composables";
const formatter = useAsrTrader().percentFormatter;

const props = withDefaults(
  defineProps<{
    height: string;
    value: number;
  }>(),
  {
    value: 15,
  }
);
const width = computed(() => {
  return val.value - (val.value / 10 + 1) * 0.25;
});
const val = ref(props.value);
function setVal(value: number) {
  val.value = (value + 1) * 10;
}
</script>

<template>
  <div class="percent-container">
    <TextInput type="number" label="درصد سهم" v-model="val"></TextInput>
    <div class="percent" :style="{ height: height }">
      <span
        v-for="(i, index) in 10"
        :key="index"
        @click="() => setVal(index)"
        class="point"
      >
      </span>
      <div class="selected" :style="{ width: width + '%' }">
        <span
          v-for="(i, index) in 10"
          :key="index"
          @click="() => setVal(index)"
          class="point"
        >
        </span>
      </div>
      <div class="tooltip-container" :style="{ height: height, width: width + '%' }">
        <span class="tooltip">
          {{ formatter.format(val / 100) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.percent-container {
  width: 100%;
  .percent {
    direction: ltr;
    position: relative;
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
