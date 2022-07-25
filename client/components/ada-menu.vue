<template>
<div id="menu" :style="{ left: left, right: right, top: top, bottom: bottom }">
    <slot></slot>
</div>
</template>

<script lang="ts" setup>

const props = withDefaults(defineProps<{
    left?: string ,
    top?: string,
    bottom?: string,
    right?: string
}>(), {
    left: 'auto',
    top: 'auto',
    right: 'auto',
    bottom: 'auto',
})


</script>


<style lang="postcss" scoped>
#menu{
    @apply tw-absolute tw-min-w-[163px];
    z-index: 10000;
    transform: all .5s;
}
</style>