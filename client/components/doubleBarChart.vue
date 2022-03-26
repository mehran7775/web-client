<template lang="vue">
<div class="double-chart-bar">
    <single-bar-chart :value="right/2" x="50%" success />
    <single-bar-chart :value="left/2" x-position="right" x="50%"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    left: Number,
    right: Number,
  },
  setup() {},
});
</script>
<style lang="scss" scoped>
.double-chart-bar {
  position: absolute;
  width: 96%;
  height: 100%;
  top: 0;
  left: 2%;
  content: "";
}
</style>
