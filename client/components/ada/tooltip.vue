<script setup lang="ts">
import { ref } from "vue"
const props = withDefaults(defineProps<{
    position?: 'above' | 'left' | 'right' | 'under'
}>(), {
    position: 'above'
})

const visible = ref(false)

function mouseenter() {
    visible.value = true
}
function mouseleave() {
    visible.value = false
}
</script>
<style lang="postcss" scoped>
.ada-tooltip-container {
    @apply tw-relative tw-flex tw-flex-shrink tw-justify-center tw-items-center;
    position: relative;

    .ada-tooltip {
        @apply tw-absolute tw-flex tw-justify-center tw-items-center tw-bg-tooltip tw-rounded tw-px-1;
        @apply tw-transition-all tw-ease-in-out tw-duration-500;
        min-height: calc(var(--row-height) - 8px);
        min-width: 65px;
        width: fit-content;
        z-index: 1000;
        color: white;
        pointer-events: none;
        touch-action: none;
        white-space: nowrap;
        font-weight: bolder;

        &.above {
            top: calc(0px - var(--row-height) + 4px);
            margin-left: auto;
            margin-right: auto;
        }

        &.under {
            bottom: calc(0px - var(--row-height) + 4px);
            margin-left: auto;
            margin-right: auto;
        }

        &.left {
            top: 4px;
            right: calc(100% + 4px);
        }

        &.right {
            top: 4px;
            left: calc(100% + 4px);
        }
    }
}
</style>

<template>
    <div class="ada-tooltip-container" @mouseenter="mouseenter" @mouseleave="mouseleave">
        <slot name="activator" />
        <span :style="{ opacity: visible ? 1 : 0 }" class="ada-tooltip" :class="[position]">
            <slot />
        </span>
    </div>
</template>