<template>
  <v-app>
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api";
import snackbar from "@/components/snacks.vue";

export default defineComponent({
  components: {
    snackbar,
  },
  setup(props, context) {
    const memory = ref(null);
    return { memory };
  },
});
</script>

<style lang="sass" scoped>
.v-main
  background-color: var(--v-primary-base)
  color: white
</style>