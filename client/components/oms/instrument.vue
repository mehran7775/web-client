<template>
  <v-input>{{ code }} </v-input>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  props: ["code"],
  setup(props: any) {
    
    return {
    };
  },
});
</script>

