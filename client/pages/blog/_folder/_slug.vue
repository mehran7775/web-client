<template>
  <v-container tag="article">
    <nuxt-content :document="doc" class="doc" />
  </v-container>
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
    const title = ref("");
    const description = ref("");

    async function getContent() {
      doc.value = (await ctx
        .$content(ctx.params.value.folder || "index", ctx.params.value.slug)
        .fetch());
      title.value = doc.value ? Array.isArray(doc.value) ? doc.value[0].title : doc.value.title : "";
    }

    getContent();
    useMeta({ title: title as unknown as string, meta:[
      {
        hid: 'description',
        name: 'description',
        content: description as unknown as string
      }
    ] });

    return {
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
    pre, code, .sourceCode, .ltr
      direction: ltr
      text-align: left
      unicode-bidi: -webkit-isolate
      unicode-bidi: -moz-isolate
      unicode-bidi: isolate
</style>

