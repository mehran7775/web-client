<script lang="ts" setup>
const props = withDefaults(defineProps<{
  left?: number,
  right?: number,
}>(), {
  left: 0,
  right: 0
})
</script>
<style lang="postcss" scoped>
.double-chart-bar {
  position: absolute;
  width: 96%;
  height: 100%;
  top: 0;
  left: 2%;
  content: "";
}
</style>

<template >
  <div class="double-chart-bar">
    <single-bar-chart :value="right / 2" x="50%" success />
    <single-bar-chart :value="left / 2" x-position="right" x="50%" />
  </div>
</template>