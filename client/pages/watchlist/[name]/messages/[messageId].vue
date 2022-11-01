<script setup lang="ts">
import { useMessages } from "~~/composables";
const route = useRoute();
const messageManager = useMessages();


messageManager.message_active = await messageManager.getMessage(
  parseInt(route.params.messageId as string)
);
 
const componentName = computed(() => `message${messageManager.message_active?.messageType}`);
const componentModel = computed(() => messageManager.message_active.message);
</script>

<template>
  <component :is="componentName" v-model="componentModel"></component>
</template>
