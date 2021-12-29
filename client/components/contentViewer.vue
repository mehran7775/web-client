<template>
  <splitpanes class="default-theme" :rtl="rtl">
    <pane class="tok" min-size="10" max-size="30">
      <div class="pie-1 pie">
      </div>
      <v-list class="toc-md">
        <v-list-item-group>
          <v-list-item
            v-for="link of document ? document.toc : []"
            :key="link.id"
            :to="`#${link.id}`"
            :class="['depth-' + link.depth]"
          >
            <span v-for="i in (link.depth - 2) * 4" :key="i"> &nbsp; </span>
            {{ link.text }}
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </pane>
    <pane size="80">
      <v-container class="article ma-0 pa-5" tag="article">
        <div class="pie-2 pie">
        </div>
        <div class="pie-3 pie">
        </div>
        <nuxt-content :document="document" class="doc-md" />
      </v-container>
    </pane>
  </splitpanes>
</template>

<script lang="ts">
import { FetchReturn } from "@nuxt/content/types/query-builder";
import { Splitpanes, Pane } from "splitpanes";

import {
  defineComponent,
  ref,
  useMeta,
  useStore,
  computed,
  watch,
} from "@nuxtjs/composition-api";

export default defineComponent({
  head: {},
  props: {
    document: Object,
  },
  components: {
    Splitpanes,
    Pane,
  },
  setup(params) {
    const doc = ref(params.document as FetchReturn | FetchReturn[] | null);
    const store = useStore();
    const rtl = computed(() => {
      return store.getters["rtl"];
    });
    const title = ref("");
    const description = ref("");

    watch(
      () => params.document,
      (current, old) => {
        title.value = current?.title;
        description.value = current?.description;
      }
    );

    useMeta({
      title: title as unknown as string,
      meta: [
        {
          hid: "description",
          name: "description",
          content: description as unknown as string,
        },
      ],
    });

    return {
      rtl,
    };
  },
});
</script>

<style lang="sass" scoped>
.pie-1
  top: 25px
  right: -390px
.pie-2
  top: 0
  right: -25%
  transform: scale(50%)
.pie-3
  bottom: -35%
  left: 0
  transform: scale(75%)
.article
  width: 100%
  height: 100%
  position: relative
.tok
  position: relative
.toc-md
  .v-list,
  &.v-list
    color: inherit
    background-color: transparent
    .v-list-item
      color: inherit
</style>
