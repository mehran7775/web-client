<script setup lang="ts">
import { ref, useNuxtApp, reactive, useRoute, useRouter } from "#app";
import { AutoCompleteItem, InstrumentSearchModel } from "@/types";
import FocusBoard from "@/components/dashboard/focusBoard/index.vue";
import WatchList from "~/components/dashboard/WatchList/index.vue";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const searchModel = ref(new InstrumentSearchModel());
searchModel.value.length = 15;
const { $i18n: i18n } = useNuxtApp();
const industry = ref(-1);
const instruments: Array<string> = reactive([]);
industry.value = parseInt((route.params["industry"] as string | null) ?? "-1");

async function select(val: AutoCompleteItem) {
  loading.value = true;
    try {
      router.push("/watchlist/industries/" + val.id);
      searchModel.value.secIds = [parseInt(val.id)];
    } finally {
      loading.value = false;
    }
}

</script>
<template>

</template>

<style lang="postcss" scoped>
.menu {
  max-width: 164px;
  background-color: rgba(var(--c-primary), 0.05);
  border-radius: var(--border-radius-root);
}
</style>