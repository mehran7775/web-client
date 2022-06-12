<script setup lang="ts">
import { MenuItem } from '@/types';
import { computed } from "#app";

const props = withDefaults(defineProps<{
    tag: 'li' | 'dd';
    value?: MenuItem
}>(), {
    tag: 'li',
});
</script>
<style lang="postcss" scoped>
.ada-list-item {
    @apply tw-flex tw-flex-grow;
    min-height: var(--row-height);
}
</style>
//TODO multiple root element in vue 3
<template>
    <component :is="tag" class="ada-list-item">
        <slot>
            <h4>{{ $t(value.title) }}</h4>
        </slot>
    </component>
</template>