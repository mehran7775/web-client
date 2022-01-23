<template>
  <v-card class="ma-0 pa-0" flat tile>
    <v-toolbar :height="42" color="defualt-bg" flat dense>
      <slot name="toolbar"> </slot>
      <v-spacer />
      <v-btn
        @click="setHome"
        height="28"
        width="28"
        depressed
        class="ma-0"
        small
      >
        <v-icon :color="isHome ? 'primary' : 'default'" small>
          isax-home-hashtag
        </v-icon>
      </v-btn>
      <v-btn-toggle class="mode" color="primary" v-model="viewMode" mandatory>
        <v-btn height="28" width="28" depressed class="ma-0" small>
          <v-icon :color="viewMode == 0 ? 'primary' : 'default'" small>
            isax-menu
          </v-icon>
        </v-btn>
        <v-btn height="28" width="28" depressed class="ma-0" small>
          <v-icon :color="viewMode == 1 ? 'primary' : 'default'" small>
            isax-element-3-bold
          </v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-toolbar>
    <v-card-text class="ma-0 pa-0 focus-board" v-if="instruments.length > 0">
      <v-window v-model="viewMode">
        <v-window-item>
          <tab-view />
        </v-window-item>
        <v-window-item>
          <card-view />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  useStore,
  useRoute,
  ComputedRef,
} from "@nuxtjs/composition-api";
import { useShortcut } from "@/utils/shortcutManager";
import CardView from "./cardView.vue";
import TabView from "./tabView.vue";
import { User } from "~/types";

export default defineComponent({
  components: {
    CardView,
    TabView,
  },
  name: "focus-board",
  setup(props) {
    const store = useStore();
    const sh = useShortcut();
    const route = useRoute();

    const me: ComputedRef<User> = computed(() => store.getters["sso/user/me"]);
    const isHome = computed(() => me.value.settings.home == route.value.path);

    const instruments = computed(
      () => store.getters["oms/instruments/getFocus"]
    );
    const viewMode = computed({
      set(value: number) {
        store.commit("oms/instruments/setFocusMode", value);
      },
      get() {
        return store.getters["oms/instruments/getFocusMode"];
      },
    });
    async function setHome() {
      await store.dispatch("sso/user/update_settings", {
        path: "/home",
        value: route.value.path,
      });
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
      setHome,
      isHome,
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