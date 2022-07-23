<script setup lang="ts">
import snackbar from "@/components/snacks.vue";
import { computed } from "vue";
import { useAsrTrader } from "~/composables";

const appManager = useAsrTrader();
const locale = computed(() => appManager.locale);
const rtl = computed(() => appManager.rtl);
</script>

<template>
  <div :class="[locale, rtl ? 'rtl' : 'ltr']" class="page">
    <main>
      <nuxt />
    </main>
    <footer class="tw-justify-start tw-text-start tw-h-[32px]" absolute>
      <span>
        طراحی و توسعه شرکت عصر دانش افزار
      </span>
    </footer>
    <snackbar />
  </div>
</template>

<style lang="postcss" scoped>
.page {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--c-primary-rgb);
  color: white;
  height: 100vh;

  main {
    min-height: calc(100vh - 32px);
  }

  footer {
    @apply tw-px-2;
  }
}
</style>
