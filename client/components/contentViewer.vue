<script setup lang="ts">
import { useAsrTrader, useContent } from "~/composables";
import { ref, reactive, computed } from "#app";

const params = defineProps<{
  src: string;
}>();

const appManager = useAsrTrader();
const cntManager = useContent();
const locale = computed(() => appManager.locale);
const docs = ref({ path: params.src, ctx: "" });
if (process.client) {
  for (let i = 1; i < 3; i++) {
    cntManager.getContent(locale.value + params.src + ".md").then((res) => {
      docs.value.ctx = res;
    });
  }
}
</script>
<template>
  <article class="doc-md" v-html="docs.ctx"></article>
</template>
