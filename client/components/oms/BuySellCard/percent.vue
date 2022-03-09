<script setup lang="ts">
import { reactive, ref } from "@nuxtjs/composition-api";

const props = defineProps<{
  height: string;
}>();

const val = ref(0);
</script>

<template>
  <div class="percent" :style="{ height: height }">
    <span
      v-for="(i, index) in 11"
      :key="index"
      :class="['point', index * 10 <= val ? 'selected' : '']"
      @click="
        () => {
          val = index * 10;
        }
      "
    >
      <span class="tooltip">
        {{ index * 10 }}
      </span>
    </span>
  </div>
</template>

<style lang="postcss">
.percent {
  direction: ltr;
  .point {
    display: inline-block;
    width: 20px;
    height: 6px;
    margin: auto 0 auto 3px;
    border-radius: 6px;
    content: "";
    background-color: var(--c-default-rgb);
    position: relative;
    .tooltip {
      color: white;
      position: absolute;
      display: none;
      top: -13px;
      left: 3px;
      width: 14px;
      height: 10px;
      line-height: 10px;
      border-radius: 2px;
      font-size: 6px;

      text-align: center;
    }
    &:hover {
      background-color: rgba(var(--c-primary), 0.5);
      .tooltip {
        display: block;
        background-color: var(--c-primary-rgb);
      }
    }
    &.selected {
      background-color: var(--c-primary-rgb);
    }
  }
}
</style>
