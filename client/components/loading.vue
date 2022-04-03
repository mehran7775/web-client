<template>
  <div v-show="loading" class="loading">
    <v-progress-circular indeterminate color="white" class="d-inline" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "#app";

export default defineComponent({
  name: "loading",
  props: {
    loading: Boolean,
  },
  setup(props) {
    return {};
  },
});
</script>
<style lang="postcss" scoped>
.loading {
  justify-content: center;
  align-items: center;
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
</style>
