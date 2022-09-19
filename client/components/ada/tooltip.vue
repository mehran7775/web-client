<script setup lang="ts">
import { ref } from "vue";
const props = withDefaults(
  defineProps<{
    position?: "above" | "left" | "right" | "under";
  }>(),
  {
    position: "above",
  }
);

const tooltip = ref(null);
const tooltipContent = ref(null);
const visible = ref(false);

function mouseenter() {
  visible.value = true;
}
function mouseleave() {
  visible.value = false;
}

const style = computed(() => {
  return doStyling();
});

const doStyling = () => {
  const properties = tooltip.value?.getBoundingClientRect();
  const pContent = tooltipContent.value?.getBoundingClientRect();
  const top = properties?.top;
  const left = properties?.left;
  const right = properties?.right;
  const bottom = properties?.bottom;
  let res = {};
  if (props.position === "left") {
    res["top"] = `${top}px`;
    res["left"] = `${left - pContent?.width - 5}px`;
  } else if (props.position === "right") {
    res["top"] = `${top}px`;
    res["left"] = `${right + 5}px`;
  } else if (props.position === "under") {
    res["top"] = `${bottom + 5}px`;
    res["left"] = `${left - pContent?.width / 2 + properties?.width / 2}px`;
  } else {
    res["top"] = `${top - pContent?.height - 5}px`;
    res["left"] = `${left - pContent?.width / 2 + properties?.width / 2}px`;
  }
  return res;
};
</script>
<style lang="postcss" scoped>
.ada-tooltip-container {
  @apply tw-relative tw-w-fit tw-h-fit;
}
</style>
<style lang="postcss">
.ada-tooltip {
  @apply tw-absolute tw-w-fit tw-flex tw-justify-center tw-items-center tw-bg-primary tw-rounded tw-px-1 tw-text-white tw-pointer-events-none;
  min-width: 20px;
  min-height: 20px;
  z-index: 1000;
  touch-action: none;
  white-space: nowrap;
  font-weight: bolder;
}
</style>
<template>
  <div
    ref="tooltip"
    class="ada-tooltip-container"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  >
    <slot name="activator"></slot>
    <Teleport to="body">
      <Transition name="slide-fade">
        <span
          v-if="visible"
          ref="tooltipContent"
          :style="style"
          class="ada-tooltip"
        >
          <slot />
        </span>
      </Transition>
    </Teleport>
  </div>
</template>
