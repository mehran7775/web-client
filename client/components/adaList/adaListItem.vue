<script setup lang="ts">
const props = withDefaults(defineProps<{
    tag: 'li' | 'dt' | 'ds'
}>(), {
    tag: 'li'
});
</script>
<style lang="postcee" scoped>
</style>
<template>
    <component :is="tag" class="ada-list-item">
        <slot />
    </component>
</template>