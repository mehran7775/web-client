<script setup lang="ts">
import { useAsrTrader } from "~/composables";

const params = defineProps<{
  src: string;
}>();

const appManager = useAsrTrader();

const locale = computed(() => appManager.locale);
const docs = ref({ path: params.src, ctx: "" });

</script>
<template>
  <article class="doc-md" v-html="docs.ctx"></article>
</template>
