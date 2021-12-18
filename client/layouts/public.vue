<template>
  <v-app>
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import snackbar from "@/components/snacks.vue";

export default defineComponent({
  components: {
    snackbar,
  },
  setup(props, context) {},
});
</script>

<style scoped>

</style>