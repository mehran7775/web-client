<script lang="ts" setup>
const props = defineProps<{
    module: string,
}>();

const mod = defineAsyncComponent(() => import(/* @vite-ignore */props.module));

</script>
<template>
    <mod v-bind="$attrs"></mod>
</template>