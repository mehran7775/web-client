<template>
  <div>
    {{ value }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "#app";

export default defineComponent({
  props: ["value"],
  setup(prop) {},
});
</script>

