<script setup lang="ts">
import { MenuItem } from '@/types';
import { computed } from "#app";

const props = withDefaults(defineProps<{
    tag: 'li' | 'dd';
    value: MenuItem
}>(), {
    tag: 'li',
});
</script>
<style lang="postcss" scoped>
.ada-list-item {
    @apply tw-flex tw-flex-grow tw-justify-between;
    min-height: var(--row-height);

    &--active {
        >.ada-title {
            color: var(--c-primary-rgb);

            &::after {
                @apply tw-absolute tw-inset-0 tw-w-full tw-h-full;
                content: '';
                background-color: rgba(var(--c-primary), 0.1);
            }
        }
    }

    >.ada-title {
        @apply tw-flex tw-flex-grow tw-items-center;
        @apply tw-px-[9px];
        position: relative;
        color: black;
        min-height: var(--row-height);
        border-radius: var(--border-radius-root);

        &::after {
            border-radius: var(--border-radius-root);
        }

    }

    &.group {
        @apply tw-flex-col;

        >.ada-title {
            background-color: rgba(var(--c-primary), 0.1);
        }
    }
}
</style>
//TODO multiple root element in vue 3
<template>
    <component :is="tag" class="ada-list-item" :class="[value.children ? 'group' : '']">
        <slot>
            <component :is="value.to ? 'router-link' : 'h4'" :to="value.to" v-ada-ripple class="ada-title">
                {{ value.text ? value.text : $t(value.title) }}
            </component>
        </slot>
        <ada-list v-if="value.children">
            <ada-list-item v-for="child in value.children.value" :key="child.title" :value="child">
            </ada-list-item>
        </ada-list>
    </component>
</template>