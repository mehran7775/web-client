<template>
  <WatchList :watchlists=instruments />
</template>


<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  Ref,
  useStore,
} from "@nuxtjs/composition-api";
import WatchList from "~/components/WatchList.vue";

export default defineComponent({
  components: {
    WatchList,
  },
  setup() {
    const store = useStore();
    let watchlists = computed(() => store.getters["user/getWatchList"])
    const instruments = watchlists.value[Object.keys(watchlists.value)[0]]
    console.log(instruments)
    return {
      instruments
    };
  },
});
</script>


