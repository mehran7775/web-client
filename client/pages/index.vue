<template>
  <WatchList :watchlists=watchlists />
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

    return {
      watchlists: computed(() => store.getters["user/getWatchList"]),
    };
  },
});
</script>


