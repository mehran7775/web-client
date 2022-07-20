<script setup lang="ts">
import { computed } from "#app"

const props = withDefaults(defineProps<{
    color?: string
}>(), {
    color: "success"
})
const colorVal = computed(() => {
    if (props.color) {
        let tmp = props.color.split(" ");
        if (tmp.length == 1) return "var(--c-" + tmp[0] + "-rgb)";
        else return "rgba(var(--c-" + tmp[0] + "), " + tmp[1] + ")";
    }
    return undefined;
});
</script>
<style lang="postcss">
.ada-badge {
    @apply tw-flex tw-items-center;
    margin-left: calc(0.6334rem + 2.5px);
    margin-right: 0;
    position: relative;
    white-space: nowrap;

    .badge {
        position: absolute;
        display: block;
        width: 0.6334rem;
        height: 0.6334rem;
        border-radius: 0.6334rem;
        top: calc(50% - 0.3167rem);
        left: calc(-2.5px - 0.6334rem);
    }
}

.rtl .ada-badge {
    margin-right: calc(0.6334rem + 2.5px);
    margin-left: 0;

    .badge {
        left: calc(100% + 2.5px);
    }
}
</style>
<template>
    <span class="ada-badge">
        <slot></slot>
        <span class="badge" :style="{
            backgroundColor: colorVal,
        }"></span>
    </span>
</template>
