<template>
  <WatchList :watchlists="instruments" />
</template>


<script lang="ts">
import {
  computed,
  defineComponent,
  useRoute,
  useStore,
} from "@nuxtjs/composition-api";
import WatchList from "~/components/oms/WatchList.vue";

export default defineComponent({
  components: {
    WatchList,
  },
  setup(context) {
    const route = useRoute();
    const store = useStore();
    let name = route.value.params.name;
    let watchlists = computed(() => store.getters["user/watchList"]);
    const instruments =
      watchlists.value[name ?? Object.keys(watchlists.value)[0]];
    return {
      instruments,
    };
  },
});
</script>
