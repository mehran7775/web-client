<script setup lang="ts">
const props = withDefaults(defineProps<{
    fixed: boolean;
    value: boolean;
    mini: boolean;
    minWidth: number | string;
    maxWidth: number | string;
}>(), {
    fixed: false,
    value: true,
    minWidth: '48px',
    maxWidth: '300px'
})
</script>
<style lang="postcss" scoped>
.ada-nav {
    @apply tw-flex;
    @apply tw-transition-all tw-ease-in-out tw-duration-500;
    z-index: 1000;

    >:nth-child(2) {
        @apply tw-transition-all tw-ease-in-out tw-duration-500;
    }

    &-mini {
        >:nth-child(2) {
            max-width: 0;
            width: 0 !important;
            overflow: hidden;
            opacity: 0;
            pointer-events: none;
            touch-action: none;
        }
    }

}
</style>
<template>
    <div class="ada-nav" :style="{
        minWidth: !mini ? maxWidth : minWidth,
        maxWidth: !mini ? maxWidth : minWidth,
        position: fixed ? 'fixed' : 'relative'
    }" :class="[mini ? 'ada-nav-mini' : '']">
        <slot />
    </div>
</template>