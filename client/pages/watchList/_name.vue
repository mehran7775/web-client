<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-row class="ma-0 pa-0" dense>
      <v-col class="ma-0 pa-0">
        <focus-board />
      </v-col>
    </v-row>
    <v-row class="ma-0 pa-0" dense>
      <v-col>
        <WatchList :watchlists="instruments" />
      </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts">
import {
  computed,
  defineComponent,
  useContext,
  useRoute,
  useStore,
} from "@nuxtjs/composition-api";
import FocusBoard from "@/components/dashboard/focusBoard/index.vue";
import WatchList from "@/components/dashboard/WatchList.vue";

export default defineComponent({
  components: {
    WatchList,
    FocusBoard,
  },
  setup(context) {
    const route = useRoute();
    const store = useStore();
    const ctx = useContext();
    let name = route.value.params.name;
    let watchlists = computed(() => store.getters["sso/user/watchList"]);
    const instruments = computed(() => watchlists.value[name]);
    if (!name) {
      ctx.redirect(Object.keys(watchlists.value)[0]);
    }
    return {
      instruments,
    };
  },
});
</script>
