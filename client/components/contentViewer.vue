<template>
  <splitpanes class="default-theme" :rtl="rtl">
    <pane min-size="10" max-size="30">
      <v-list class="toc">
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
      <v-container tag="article">
        <nuxt-content :document="document" class="doc" />
      </v-container>
    </pane>
  </splitpanes>
</template>

<script lang="ts">
import { FetchReturn } from "@nuxt/content/types/query-builder";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

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

<style lang="sass">
.doc
  *
    text-align: start
    unicode-bidi: plaintext
  h1
    text-align: center
  pre, code, .sourceCode, .ltr
    direction: ltr
    text-align: left
    unicode-bidi: -webkit-isolate
    unicode-bidi: -moz-isolate
    unicode-bidi: isolate
.toc
  height: calc(100vh - 96px)
  overflow: auto
</style>
