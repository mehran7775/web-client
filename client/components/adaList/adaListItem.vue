<script setup lang="ts">
import { BookmarkPosition, MenuItem, CreateBookmark } from '@/types';
import { ref } from "#app";

const props = withDefaults(defineProps<{
    tag: 'li' | 'dd';
    value: MenuItem
}>(), {
    tag: 'li',
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

            .icon {
                @apply tw-transition-all tw-ease-in-out tw-duration-300;
            }

            background-color: rgba(var(--c-primary), 0.1);
        }
    }

    &-open {
        &.group {
            max-height: 100%;

            .isax-arrow-down {
                @apply tw-rotate-180;
            }

            .ada-list-item::before {
                @apply tw-absolute tw-h-[34px] tw-w-[8px];
                content: '';
                border-right: solid 1px rgba(0, 0, 0, 0.1);
                border-bottom: solid 1px rgba(0, 0, 0, 0.1);
                margin-top: -16px;
                margin-inline-start: 8px;
                border-radius: 0 0 6px 0;
            }

        }
    }

    .ada-list {
        @apply tw-mx-5;
    }
}
</style>
//TODO multiple root element in vue 3
<template>
    <component :is="tag" class="ada-list-item" :class="[
        open ? 'ada-list-item-open' : 'ada-list-item-close',
        value.children ? 'group' : ''
    ]">
        <slot>
            <component @click="() => value.children ? toggleGroup() : null" :is="value.to ? 'router-link' : 'span'"
                :to="value.to" v-ada-ripple class="ada-title">
                <slot name="item" :value="value"></slot>
                <ada-icon v-if="value.children">
                    isax-arrow-down
                </ada-icon>
            </component>
        </slot>
        <ada-list v-if="value.children">
            <ada-list-item v-for="child in value.children.value" :key="child.title" :value="child">
               <slot name="item" :value="child"></slot>
            </ada-list-item>
        </ada-list>
    </component>
</template>