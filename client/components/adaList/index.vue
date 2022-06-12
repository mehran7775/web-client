<script setup lang="ts">
const props = withDefaults(defineProps<{
    tag: 'menu' | 'ul' | 'ol' | 'dl'
}>(), {
    tag: 'ol'
});
</script>
<style lang="postcss" scoped>
.ada-list{
    @apply tw-flex tw-flex-col;
}
</style>
<template>
    <component :is="tag" class="ada-list">
        <slot name="activator" />
        <slot />
    </component>
</template>
