<template>
  <content-viewer :document="doc" />
</template>

<script lang="ts">
import { FetchReturn } from "@nuxt/content/types/query-builder";
import {
  defineComponent,
  useContext,
  ref,
  Ref,
  useMeta,
} from "@nuxtjs/composition-api";

export default defineComponent({
  head: {},
  setup(params) {
    const ctx = useContext();
    const doc: Ref<FetchReturn | FetchReturn[] | null> = ref(null);

    async function getContent() {
      doc.value = (await ctx
        .$content(ctx.params.value.folder || "index", ctx.params.value.slug)
        .fetch());
    }

    getContent();
    return {
      doc,
    };
  },
});
</script>
