<template>
  <v-container>
    <nuxt-content :document="doc" class="doc" tag="article" />
  </v-container>
</template>

<script lang="ts">
import { IContentDocument } from "@nuxt/content/types/content";
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
    const doc: Ref<IContentDocument | null> = ref(null);
    const title = ref("");
    const description = ref("");

    async function getContent() {
      doc.value = (await ctx
        .$content(ctx.params.value.slug || "hello")
        .fetch()) as IContentDocument;
      title.value = doc.value?.title;
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

