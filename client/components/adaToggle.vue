<script setup lang="ts">
import { computed, useSlots, onBeforeMount } from "#app";
const slots = useSlots();
onBeforeMount(() => {
  if (slots.default) console.log(slots.default());
});
</script>
<template>
  <div>
    <slot />
  </div>
</template>
