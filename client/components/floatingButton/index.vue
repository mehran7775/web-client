<template>
  <v-fab-transition>
    <v-btn class="floating-btn" :style="props" fab v-bind="$attrs">
      <slot />
    </v-btn>
  </v-fab-transition>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    left: {
      type: String,
      default: undefined,
    },
    top: {
      type: String,
      default: undefined,
    },
    right: {
      type: String,
      default: undefined,
    },
    bottom: {
      type: String,
      default: undefined,
    },
    position: {
      type: String,
      default: "absolute",
    },
    "z-index": {
      type: [Number, String],
      default: 1000,
    },
    width: {
      type: String,
      default: undefined,
    },
    height: {
      type: String,
      default: undefined,
    },
  },
  inheritAttrs: false,
  setup(props) {
    return { props };
  },
});
</script>
