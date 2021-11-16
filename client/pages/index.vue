<template>
  <splitpanes class="default-theme" :rtl="rtl">
    <pane min-size="10" max-size="30">
      <v-list>
        <v-list-item-group>
          <v-list-item
            v-for="link of doc ? doc.toc : []"
            :key="link.id"
            :to="`#${link.id}`"
          >
            {{ link.text }}
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </pane>
    <pane size="80">
      <v-container tag="article">
        <nuxt-content :document="doc" class="doc" />
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
  useContext,
  ref,
  Ref,
  useMeta,
  useStore,
  computed,
} from "@nuxtjs/composition-api";

export default defineComponent({
  head: {},
  components: {
    Splitpanes,
    Pane,
  },
  setup(params) {
    const ctx = useContext();
    const doc: Ref<FetchReturn | FetchReturn[] | null> = ref(null);
    const title = ref("");
    const description = ref("");
    const store = useStore();
    const rtl = computed(() => {
      return store.getters["rtl"];
    });

    async function getContent() {
      doc.value = await ctx.$content("index").fetch();
      console.log(doc.value);
      title.value = doc.value
        ? Array.isArray(doc.value)
          ? doc.value[0].title
          : doc.value.title
        : "";
    }

    getContent();
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
      doc,
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
</style>

