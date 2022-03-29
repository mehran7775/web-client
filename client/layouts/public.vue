<script setup lang="ts">
import snackbar from "@/components/snacks.vue";
import { useAsrTrader } from "~/composables";

const appManager = useAsrTrader();
const locale = appManager.locale;
</script>

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

<style lang="postcss" scoped>
.v-main {
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--c-primary-rgb);
  color: white;
  min-height: 100vh;
}
</style>
