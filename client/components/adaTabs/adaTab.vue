<script setup lang="ts">
import { inject, ref, Ref, computed } from "#app";
const props = defineProps<{
    model?: any,
    name?: string
}>();
const val: Ref<any> = inject("tab-ref", ref(null));
const name: Ref<any> = inject("tab-name", ref(null));
const cls = computed(() => val.value == props.model || name.value == props.name ? 'tab--active' : '')
</script>
<style lang="postcss" scoped>
.tab {
    @apply tw-absolute tw-h-full tw-w-full tw-flex;
    @apply tw-transition-all tw-ease-in-out tw-duration-700 tw-transform;
    background-color: var(--c-default-bg-rgb);
    opacity: 0;

    &--active {
        @apply tw-inset-0;
        opacity: 1
    }
}

.ltr .tab {
    @apply tw-inset-x-full;

    &--active {
        @apply tw-inset-x-0;

        ~.tab {
            @apply -tw-inset-x-full;
        }
    }
}

.rtl .tab {
    @apply -tw-inset-x-full;

    &--active {
        @apply tw-inset-x-0;

        ~.tab {
            @apply tw-inset-x-full;
        }
    }
}
</style>
<template>
    <div class="tab" :class="cls">
        <slot></slot>
    </div>
</template>