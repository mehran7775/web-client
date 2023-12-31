<script setup lang="ts">
import {  MenuItem } from '@/types';

const props = withDefaults(defineProps<{
    listTag?: 'menu' | 'ul' | 'ol' | 'dl',
    tag?: 'li' | 'dd';
    value: MenuItem
}>(), {
    tag: 'li',
    listTag: 'ol'
});

const open = ref(false)

function toggleGroup() {
    open.value = !open.value
}


</script>
<style lang="postcss" scoped>
.ada-list-item {
    @apply tw-flex tw-flex-grow tw-justify-between;
    @apply tw-transition-all tw-ease-in-out tw-duration-700;
    min-height: var(--row-height);
    max-height: var(--row-height);

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
        @apply tw-flex-col tw-justify-start;
        overflow: hidden;
        cursor: pointer;

        >.ada-title {
            @apply tw-flex tw-w-full tw-justify-between;

            >.icon {
                @apply tw-transition-all tw-ease-in-out tw-duration-300;
            }
        }
    }

    &-open {
        &.group {
            max-height: 100%;

            >.ada-title {
                >.icon.arrow-control {
                    @apply tw-rotate-180;
                }
            }

            .ada-list-item::before {
                content: ''; 
                margin-top: -16px;
                margin-inline-start: 8px;
                border-radius: 0 0 6px 0;
                @apply tw-absolute tw-h-[34px] tw-w-[8px] tw-border-primary tw-border-opacity-30 tw-border-r tw-border-t;
            }

        }
    }

    .ada-list {
        @apply tw-mx-5;
    }
    .nuxt-link-exact-active, .nuxt-link-active {
        @apply tw-bg-primary tw-bg-opacity-10;
    }
}
</style>
//TODO multiple root element in vue 3 (dt | dd)
<template>
    <component :is="tag" class="ada-list-item" :class="[
        open ? 'ada-list-item-open' : 'ada-list-item-close',
        value?.children ? 'group' : ''
    ]">
        <slot>
            <component @click="() => value?.children ? toggleGroup() : null" :is="value?.to ? 'router-link' : 'span'"
                :to="value?.to" class="ada-title">
                <slot name="item" :value="value"></slot>
                <ada-icon class="arrow-control" v-if="value?.children">
                    isax-arrow-down
                </ada-icon>
            </component>
        </slot>
        <ada-list :tag="listTag" v-if="value?.children">
            <ada-list-item v-for="child in value.children.value" :key="child.title" :value="child">
                <template #item>
                    <slot name="item" :value="child"></slot>
                </template>
            </ada-list-item>
        </ada-list>
    </component>
</template>