<script setup lang="ts">
const props = withDefaults(defineProps<{
    fixed?: boolean;
    modelValue?: boolean;
    mini?: boolean;
    minWidth?: number | string;
    maxWidth?: number | string;
}>(), {
    fixed: false,
    modelValue: true,
    minWidth: '48px',
    maxWidth: '300px'
})
</script>
<style lang="postcss" scoped>
.ada-nav {
    @apply tw-flex;
    @apply tw-transition-all tw-ease-in-out tw-duration-700;
    z-index: 1000;
}
</style>
<template>
    <div class="ada-nav" :style="{
        minWidth: !mini ? maxWidth : minWidth,
        maxWidth: !mini ? maxWidth : minWidth,
        position: fixed ? 'fixed' : 'relative'
    }" :class="[mini ? 'ada-nav-mini' : null]">
        <slot />
    </div>
</template>