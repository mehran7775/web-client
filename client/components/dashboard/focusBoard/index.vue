<template>
  <v-card class="ma-0 pa-0" :loading="loading" flat tile>
    <v-toolbar :height="42" color="defualt-bg" flat dense>
      <watchlist-selector class="mt-2" style="max-width: 164px" auto-route />
      <instrument-search class="ms-1 mt-2" style="max-width: 164px" focus-result />
      <v-btn
        v-if="edited"
        @click="apply"
        color="primary"
        class="ma-0 ms-1 pa-0"
        height="32"
        width="56"
      >
        {{ $t("general.apply") }}
      </v-btn>
      <v-spacer />
      <v-btn-toggle class="mode" color="primary" v-model="viewMode" mandatory>
        <v-btn height="28" width="28" depressed class="ma-0" small>
          <v-icon :color="viewMode == 0 ? 'primary' : 'default'" small>
            isax-menu-1
          </v-icon>
        </v-btn>
        <v-btn height="28" width="28" depressed  class="ma-0" small>
          <v-icon :color="viewMode == 1 ? 'primary' : 'default'" small>
            adaico-element-3
          </v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-toolbar>
    <v-card-text v-if="instruments.length > 0" class="ma-0 pa-0 focus-board">
      <card-view v-if="viewMode == 1" />
      <tab-view v-if="viewMode == 0" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  useStore,
  Ref,
  ref,
} from "@nuxtjs/composition-api";
import { useShortcut } from "@/utils/shortcutManager";
import InstrumentSearch from "@/components/oms/instrumentSearch.vue";
import CardView from "./cardView.vue";
import TabView from "./tabView.vue";

export default defineComponent({
  components: {
    InstrumentSearch,
    CardView,
    TabView,
  },
  name: "focus-board",
  setup(props) {
    const store = useStore();
    const sh = useShortcut();
    const loading = ref(false);
    const instruments = computed(
      () => store.getters["oms/instruments/getFocus"]
    );
    const edited = computed(() => store.getters["sso/user/watchlistChanged"]);
    const viewMode = computed({
      set(value: number) {
        store.commit("oms/instruments/setFocusMode", value);
      },
      get() {
        return store.getters["oms/instruments/getFocusMode"];
      },
    });
    async function apply() {
      loading.value = true;
      try {
        await store.dispatch("sso/user/update_watchlist");
      } finally {
        loading.value = false;
      }
    }

    if (process.client) {
      sh.addShortcut({
        key: "alt+q",
        action: () => {
          store.commit(
            "oms/instruments/setFocusMode",
            (store.getters["oms/instruments/getFocusMode"] + 1) % 2
          );
        },
      });
    }

    return {
      apply,
      loading,
      edited,
      viewMode,
      instruments,
    };
  },
});
</script>

<style lang="sass">
.focus-board
  .row
    margin: 0
    padding: 0
    min-height: 32px
    .col
      min-height: 32px
.mode
  &.v-btn-toggle
    > .v-btn.v-btn
      border-radius: $border-radius-root
      border: none !important
</style>