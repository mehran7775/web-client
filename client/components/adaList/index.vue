<script setup lang="ts">
const props = withDefaults(defineProps<{
    tag: 'menu' | 'ul' | 'ol' | 'dl'
}>(), {
    tag: 'ol'
});
</script>
//TODO list pading remove after removing vuetify
<style lang="postcss" scoped>
.ada-list {
    @apply tw-flex tw-flex-col;
    @apply tw-px-[4px];

    ol,
    ul,
    dl {
        padding: 0 !important;
    }
}
</style>
<template>
    <component :is="tag" class="ada-list">
        <slot name="activator" />
        <slot />
    </component>
</template>
