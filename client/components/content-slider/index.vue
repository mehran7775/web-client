<script setup lang="ts">
import { useAsrTrader, useContent } from "~/composables";
import { ref, reactive } from "#app";

const params = defineProps<{
  src: string;
  interval: number;
}>();

const appManager = useAsrTrader();
const cntManager = useContent();
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

const docs = reactive<any[]>([]);

cntManager.getContent(params.src + locale + "/slide-1.md").then((res) => {
  docs.push({
    path: "slide-1",
    ctx: res,
  });
});
</script>

<template>
  <div class="ma-0 pa-0 slider" @mouseenter="stopTimer" @mouseleave="startTimer" fluid>
    <v-window class="slide" v-model="slide">
      <v-window-item v-for="doc in docs" :key="doc.path">
        <div class="doc-md">
          {{ doc.ctx }}
        </div>
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

<style lang="postcss">
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

<style lang="postcss" scoped>
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
