<template>
  <div
    class="ma-0 pa-0 slider"
    @mouseenter="stopTimer"
    @mouseleave="startTimer"
    fluid
  >
    <v-window class="slide" v-model="slide">
      <v-window-item v-for="doc in docs" :key="doc.path">
        <nuxt-content :document="doc" class="doc-md" />
      </v-window-item>
    </v-window>
    <v-item-group class="controll" v-model="slide" mandatory>
      <v-item v-for="doc in docs" :key="doc.path" v-slot="{ active, toggle }">
        <v-btn
          height="24"
          width="24"
          :input-value="active"
          icon
          @click="toggle"
          dark
        >
          <v-icon size="16">mdi-record</v-icon>
        </v-btn>
      </v-item>
    </v-item-group>
  </div>
</template>

<script lang="ts">
import { FetchReturn } from "@nuxt/content/types/query-builder";
import {
  defineComponent,
  useContext,
  useStore,
  ref,
  Ref,
  useMeta,
  computed,
  reactive,
} from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    src: String,
    interval: Number,
  },
  setup(params) {
    const ctx = useContext();
    const store = useStore();
    const locale = computed(() => store.getters["locale"]);
    const slide = ref(0);
    let timer: NodeJS.Timeout | null = null;

    function startTimer() {
      if (params.interval)
        timer = setInterval(() => {
          if (docs.length > 0) slide.value = (slide.value + 1) % docs.length;
        }, params.interval * 1000);
    }
    function stopTimer() {
      if (timer) clearInterval(timer);
    }

    const docs: FetchReturn[] = reactive([]);

    ctx
      .$content((params.src ?? "slider") + "/" + locale.value, { deep: true })
      .fetch()
      .then((res) => {
        if (!Array.isArray(res)) docs.push(res);
        else docs.push(...res);
        startTimer();
      });

    return {
      startTimer,
      stopTimer,
      docs,
      slide,
    };
  },
});
</script>

<style lang="sass" scoped>
.slider
  height: 100%
.slide
  height: calc( 100% - 24px )
.controll
  text-align: center
  justify-content: center
  height: 24px
</style>
