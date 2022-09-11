<script lang="ts" setup>
import { OrderSearchModel, TabItem } from "@/types"

const list = defineAsyncComponent(() => import("./orders.vue"));

const props = defineProps<{
    modelValue: TabItem,
    tabs: Array<TabItem>
}>();
</script>
<template>
    <ada-tabs v-model="props.modelValue" class="tw-h-full tw-w-full">
        <ada-tab v-for="t in props.tabs" :key="t.title" :model="t" class="tw-overflow-y-auto">
            <list v-model="(t.params as OrderSearchModel)"></list>
        </ada-tab>
    </ada-tabs>
</template>