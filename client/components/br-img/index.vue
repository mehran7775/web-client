<template>
  <v-img :src="src" :max-height="height" :max-width="width" contain> </v-img>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    height: {
      type: Number,
      default: 800,
    },
    width: {
      type: Number,
      default: 800,
    },
    src: {
      type: String,
      required: true,
    },
    absolute: {
      type: Boolean,
      default: false,
    },
    top: {
      type: Number,
      default: 0,
    },
    left: {
      type: Number,
      default: 0,
    },
  },
  setup() {},
});
</script>
