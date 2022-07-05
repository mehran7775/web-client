<script setup lang="ts">
import { provide, ref, watch } from "#app";
const props = withDefaults(
    defineProps<{
        value: any;
        nameKey: string;
    }>(),
    {
        value: 0,
        nameKey: '$'
    }
);
const val = ref(props.value);
const name = ref(eval(props.nameKey.replace('$', 'props.value')))
provide("tab-ref", val);
provide("tab-name", name);
watch(
    () => props.value,
    (update) => {
        val.value = update;
        name.value = eval(props.nameKey.replace('$', 'update'));
    }
);
</script>
<style lang="postcss" scoped>
.tabs {
    @apply tw-relative tw-overflow-clip;
}
</style>
<template>
    <div class="tabs">
        <slot></slot>
    </div>
</template>