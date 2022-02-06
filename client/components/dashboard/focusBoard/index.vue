<template>
  <v-card class="ma-0 pa-0" flat tile>
    <v-toolbar :height="42" color="defualt-bg" flat dense>
      <slot name="toolbar"> </slot>
      <v-tooltip v-for="b in bookmarks" :key="b.to">
        <template #activator="{ on, attrs }">
          <v-btn
            color="primary"
            :to="b.to"
            v-on="on"
            v-bind="attrs"
            height="28"
            class="ms-1 me-1 px-2 bookmark"
          >
            <v-btn
              @click.stop.prevent="() => unmark(b)"
              width="14"
              height="14"
              class="removeMark pa-0 ma-0"
              color="error"
            >
              <v-icon class="pa-0 ma-0" x-small>mdi-close</v-icon>
            </v-btn>
            <span class="label">
              <v-icon v-if="b.icon" x-small> {{ b.icon }} </v-icon>
              {{ b.text ? b.text : $t(b.title) }}
            </span>
          </v-btn>
        </template>
        {{ b.text ? b.text : $t(b.title) }}
      </v-tooltip>
      <v-spacer />
      <!-- <v-btn
        @click="setHome"
        height="28"
        width="28"
        depressed
        class="ma-0"
        small
      >
        <v-icon :color="home == path ? 'primary' : 'default'" small>
          isax-home-hashtag
        </v-icon>
      </v-btn> -->
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
} from "@nuxtjs/composition-api";
import { useShortcut } from "@/utils/shortcutManager";
import CardView from "./cardView.vue";
import TabView from "./tabView.vue";
import { Bookmark } from "~/types";
import { useInstrument, useUser } from "~/composables";

export default defineComponent({
  components: {
    CardView,
    TabView,
  },
  name: "focus-board",
  setup(props) {
    const store = useStore();
    const instrumentManager = useInstrument(store);
    const userManager = useUser(store);
    const sh = useShortcut();
    const route = useRoute();

    const me = userManager.me;
    const bookmarks = userManager.getBookmarks;
    const home = computed(() => me.value.settings.home);
    const path = computed(() => route.value.fullPath);

    const instruments = instrumentManager.getFocus;

    const viewMode = instrumentManager.focusMode;

    async function setHome() {
      await userManager.update_settings({
        path: "/home",
        value: path.value,
      });
    }

    async function unmark(bookmark: Bookmark) {
      const tmp = [...bookmarks.value.filter((item) => item.to != bookmark.to)];
      userManager.update_settings({
        path: "/bookmarks",
        value: tmp,
      });
    }

    if (process.client) {
      sh.addShortcut({
        key: "alt+q",
        action: () => {
          instrumentManager.focusMode.value =
            (instrumentManager.focusMode.value + 1) % 2;
        },
      });
    }

    return {
      setHome,
      unmark,
      route,
      home,
      path,
      viewMode,
      instruments,
      bookmarks,
    };
  },
});
</script>

<style lang="sass" scoped>
.bookmark
  position: relative
  width: 75px
  .label
    max-width: calc(75px - 8px)
    text-overflow: ellipsis
    overflow: hidden
    white-space: nowrap
  .removeMark
    position: absolute
    top: -10px
    left: -15px
    z-index: 1000
    display: none
  &:hover
    .removeMark
      display: block
</style>

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