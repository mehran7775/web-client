<template>
  <content-viewer :document="doc" />
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
} from "@nuxtjs/composition-api";
import ContentViewer from "~/components/contentViewer.vue";

export default defineComponent({
  layout: "public",
  head: {},
  components: {
    Splitpanes,
    Pane,
    ContentViewer,
  },
  setup(params) {
    const ctx = useContext();
    const doc: Ref<FetchReturn | FetchReturn[] | null> = ref(null);
    
    async function getContent() {
      doc.value = await ctx.$content("index").fetch();
    }

    getContent();
    return {
      doc,
    };
  },
});
</script>

