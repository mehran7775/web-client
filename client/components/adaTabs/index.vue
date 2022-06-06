<script setup lang="ts">
import { provide, ref, watch } from "#app";
const props = withDefaults(
    defineProps<{
        value: any;
    }>(),
    {
        value: 0,
    }
);
const val = ref(props.value);
provide("tab-ref", val);
watch(
    () => props.value,
    (update) => {
        console.log(update);
        val.value = update;
    }
);
</script>
<style lang="postcss" scoped>
.tabs {
    @apply tw-relative tw-overflow-hidden;
}
</style>
<template>
    <div class="tabs">
        <slot></slot>
    </div>
</template>