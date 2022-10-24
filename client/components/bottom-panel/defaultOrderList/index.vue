<script lang="ts" setup>
import { Order, OrderSearchModel, PaginatedResult, TabItem } from "@/types"
import { useOrder } from "~~/composables";

const list = defineAsyncComponent(() => import("./orders.vue"));

const props = defineProps<{
    modelValue: TabItem,
    tabs: Array<TabItem>
}>();


const orderManager = useOrder()
const route = useRoute()
const bottomPanel = useBottomPanel()


const orders = reactive<{ items: Order[] }>({ items: [] })

watch(() => [ route.query , orderManager.last_update ], () => {
  getOrders(route.params.slug && route.query.length ? route.query : { offset: 0, length: 20})
})

async function getOrders(qu) {
  bottomPanel.setLoading(true);
  orders.items.splice(0, Infinity)
  await orderManager
    .getOrders(qu as OrderSearchModel)
    .then((res: PaginatedResult<Order> | undefined) => {
      if (res) orders.items.push(...res.data);
      bottomPanel.setLoading(false);
    })
}


getOrders(route.params.slug && route.query.length ? route.query : { offset: 0, length: 20})




</script>
<template>
    <ada-tabs v-model="props.modelValue" class="tw-h-full tw-w-full">
        <ada-tab v-for="t in props.tabs" :key="t.title" :model="t" class="tw-overflow-y-auto">
            <list :orders="orders.items"></list>
        </ada-tab>
    </ada-tabs>
</template>