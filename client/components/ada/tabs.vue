<script setup lang="ts">

const props = withDefaults(
    defineProps<{
        modelValue?: any;
        nameKey?: string;
    }>(),
    {
        modelValue: 0,
        nameKey: '$'
    }
);
const val = ref(props.modelValue);
const name = ref(eval(props.nameKey.replace('$', 'props.modelValue')))
provide("tab-ref", val);
provide("tab-name", name);
watch(
    () => props.modelValue,
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