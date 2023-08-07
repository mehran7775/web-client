<script setup lang="ts">
import { useMessages } from "~~/composables";

definePageMeta({
  pageTransition: {
    name: "page-fade"
  },
})


const route = useRoute();
const messageManager = useMessages();

async function getMessage() {
  messageManager.message_active = await messageManager.getMessage(
    parseInt(route.params.messageId as string)
  );
}
await getMessage(); 

const componentName = computed(() => {
  messageManager.message_active;
  return `message-${ messageManager.message_active?.messageType ?? messageManager.message_active?.type}`;
});

</script>

<template>
  <component
    :is="componentName"
    v-model="messageManager.message_active.message"
  ></component>
</template>
