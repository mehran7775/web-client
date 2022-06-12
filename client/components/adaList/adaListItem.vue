<script setup lang="ts">
import { MenuItem } from '@/types';
import { computed } from "#app";

const props = withDefaults(defineProps<{
    tag: 'li' | 'dt' | 'ds';
    value?: MenuItem
}>(), {
    tag: 'li',
});
const cmp = computed(() => props.value?.children ? 'adaList' : props.tag)
</script>
<style lang="postcss" scoped>
.ada-list-item {
    @apply tw-flex tw-flex-grow;
    min-height: var(--row-height);
}
</style>
<template>
    <component :is="cmp" class="ada-list-item">
        <slot />
    </component>
</template>