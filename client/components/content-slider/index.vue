<template>
  <div class="ma-0 pa-0 slider" @mouseenter="stopTimer" @mouseleave="startTimer" fluid>
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
          class="mx-2 pa-0"
          :input-value="active"
          @click="toggle"
          aria-hidden
          icon
          dark
        >
          <div
            class="item"
            :style="{ height: '8px', width: active ? '28px' : '8px' }"
          ></div>
        </v-btn>
      </v-item>
    </v-item-group>
    <div></div>
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
import { useAsrTrader } from "~/composables";

export default defineComponent({
  props: {
    src: String,
    interval: Number,
  },
  setup(params) {
    const ctx = useContext();
    const store = useStore();
    const appManager = useAsrTrader(store);
    const locale = appManager.locale;
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

<style lang="scss">
.controll {
  .v-btn {
    &--active {
      &::before {
        display: none;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.hover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 24px);
}
.slider {
  position: relative;
  height: 100%;
}
.slide {
  height: calc(100% - 24px);
  overflow: auto;
}
.controll {
  text-align: center;
  justify-content: center;
  height: 24px;
  .v-btn {
    border: none !important;
    .item {
      transition: all 0.2s ease-in-out;
      display: inline-block;
      background-color: white;
      border-radius: 4px;
    }
  }
}
</style>
