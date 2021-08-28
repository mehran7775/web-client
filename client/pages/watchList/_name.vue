<template>
  <WatchList :watchlists=instruments />
</template>


<script lang="ts">
import { computed, defineComponent, useRoute, useStore } from "@nuxtjs/composition-api";
import WatchList from "~/components/WatchList.vue";

export default defineComponent({

  components: {
    WatchList,
  },
  setup(context) {
    let route = useRoute();
    let name = route.value.params.name;
    const store = useStore();
    let watchlists = computed(() => store.getters["user/getWatchList"]);
    const instruments = watchlists.value[name]
    return {
      instruments
    };
  },
});
</script>
