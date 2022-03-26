<template>
  <v-app :class="locale">
    <v-main>
      <nuxt />
      <v-footer color="transparent" class="justify-start text-start" absolute>
        <span class="default--text text--lighten-2">
          طراحی و توسعه شرکت عصر دانش افزار
        </span>
      </v-footer>
    </v-main>
    <snackbar />
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, computed, useStore } from "@nuxtjs/composition-api";
import snackbar from "@/components/snacks.vue";
import { useAsrTrader } from "~/composables";

export default defineComponent({
  components: {
    snackbar,
  },
  setup(props, context) {
    const store = useStore();
    const appManager = useAsrTrader(store);
    const locale = appManager.locale;
    const memory = ref(null);
    return { memory, locale };
  },
});
</script>

<style lang="postcss" scoped>
.v-main {
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--c-primary-rgb);
  color: white;
  min-height: 100vh;
}
</style>
