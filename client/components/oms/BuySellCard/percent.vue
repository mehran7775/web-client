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
  return val.value - (val.value / 10) * 0.011857708;
});
const val = ref(props.value);
function setVal(value: number) {
  val.value = (value + 1) * 10;
  console.log(val.value, width.value);
}
</script>

<template>
  <div dir="ltr">
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
        <span class="tooltip">
          {{ formatter.format(val) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.percent {
  direction: ltr;
  position: relative;
  .tooltip {
    color: white;
    position: absolute;
    display: block;
    top: -13px;
    right: 0;
    width: 14px;
    height: 10px;
    line-height: 10px;
    border-radius: 2px;
    font-size: 6px;
    text-align: center;
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
    margin: auto 0 auto 3px;
    border-radius: 6px;
    content: "";
    background-color: var(--c-default-rgb);
    &:hover {
      background-color: rgba(var(--c-primary), 0.5);
      .tooltip {
        display: block;
        background-color: var(--c-primary-rgb);
      }
    }
  }
}
</style>
