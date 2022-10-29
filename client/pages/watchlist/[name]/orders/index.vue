<script lang="ts" setup>
import { Order, OrderSearchModel, PaginatedResult, TabItem } from "@/types";
import { useOrder } from "~~/composables";

const list = defineAsyncComponent(
  () => import("@/components/bottom-panel/orders.vue")
);

const props = defineProps<{
  modelValue: TabItem;
  tabs: Array<TabItem>;
}>();

const orderManager = useOrder();
const route = useRoute();
const bottomPanel = useBottomPanel();

const orders = reactive<{ items: Order[] }>({ items: [] });

watch(
  () => [route.query, orderManager.last_update],
  () => {
    getOrders(
      route.params.name && route.query.length
        ? route.query
        : { offset: 0, length: 20 }
    );
  }
);

async function getOrders(qu) {
  bottomPanel.setLoading(true);
  orders.items.splice(0, Infinity);
  await orderManager
    .getOrders(qu as OrderSearchModel)
    .then((res: PaginatedResult<Order> | undefined) => {
      if (res) orders.items.push(...res.data);
      bottomPanel.setLoading(false);
    });
}

getOrders(
  route.params.name && route.query.length
    ? route.query
    : { offset: 0, length: 20 }
);
</script>
<template>
  <list :orders="orders.items"></list>
</template>
