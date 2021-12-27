<template>
  <v-app :class="locale">
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, computed, useStore } from "@nuxtjs/composition-api";
import snackbar from "@/components/snacks.vue";

export default defineComponent({
  components: {
    snackbar,
  },
  setup(props, context) {
    const store = useStore()
    const locale = computed(() => {
      return store.getters["locale"];
    });
    const memory = ref(null);
    return { memory, locale };
  },
});
</script>

<style lang="sass" scoped>
.v-main
  background-color: var(--v-primary-base)
  color: white
</style>