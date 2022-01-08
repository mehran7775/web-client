<template>
  <v-card class="ma-0 pa-0" flat tile>
    <v-toolbar :height="42" flat dense>
      <watchlist-selector v-if="editMode" style="max-width: 164px" auto-route />
      <instrument-search class="ms-1" style="max-width: 164px" focus-result />
      <v-btn
        v-if="!editMode"
        @click="goEdit"
        color="primary"
        class="ma-0 ms-1 pa-0 px-1"
        height="32"
      >
        <v-icon x-small>mdi-pencil</v-icon>
        {{ $t("watchList.editor.title") }}
      </v-btn>
      <v-btn
        v-else
        @click="apply"
        color="primary"
        class="ma-0 ms-1 pa-0"
        height="32"
        width="56"
      >
        {{ $t("general.apply") }}
      </v-btn>
      <v-spacer />
      <v-btn-toggle color="primary" v-model="viewMode" mandatory>
        <v-btn height="28" small>
          <v-icon small> mdi-view-headline </v-icon>
        </v-btn>
        <v-btn height="28" small>
          <v-icon small> mdi-view-grid-outline </v-icon>
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
    const instruments = computed(
      () => store.getters["oms/instruments/getFocus"]
    );
    const editMode = computed(
      () => store.getters["oms/instruments/editWatchlist"]
    );
    const viewMode = computed({
      set(value: number) {
        store.commit("oms/instruments/setFocusMode", value);
      },
      get() {
        return store.getters["oms/instruments/getFocusMode"];
      },
    });
    function goEdit() {
      store.commit("oms/instruments/setFocus", []);
      store.commit("oms/instruments/setEditMode", true);
    }
    function apply() {
      store.commit("oms/instruments/setEditMode", false);
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
      goEdit,
      editMode,
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
</style>