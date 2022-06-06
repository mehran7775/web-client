<script setup lang="ts">
import { inject, ref, Ref, computed, watch } from "#app";
const props = defineProps<{
    model?: any
}>();
const val: Ref<any> = inject("tab-ref", ref(null));
const cls = computed(() => val.value == props.model ? 'tab--active' : '')
</script>
<style lang="postcss" scoped>
.tab {
    @apply tw-absolute tw-h-full tw-w-full tw-inset-0 tw-flex;
    @apply tw-transition-all tw-ease-in-out tw-duration-1000 tw-transform;
    background-color: var(--c-default-bg-rgb);
}

.ltr .tab {
    @apply -tw-translate-x-full;

    &--active {
        @apply tw-translate-x-0;

        ~.tab {
            @apply tw-translate-x-full;
        }
    }
}

.rtl .tab {
    @apply tw-translate-x-full;

    &--active {
        @apply tw-translate-x-0;

        ~.tab {
            @apply -tw-translate-x-full;
        }
    }
}
</style>
<template>
    <div class="tab" :class="cls">
        <slot></slot>
    </div>
</template>