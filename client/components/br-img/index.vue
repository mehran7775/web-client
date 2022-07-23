<template>
  <img :src="src" class="tw-bg-contain"/>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  height: number,
  width: number,
  src: string,    
}>(),{
  height: 800,
  width: 800
})

// export default defineComponent({
//   props: {
//     height: {
//       type: Number,
//       default: 800,
//     },
//     width: {
//       type: Number,
//       default: 800,
//     },
//     src: {
//       type: String,
//       required: true,
//     },
//     absolute: {
//       type: Boolean,
//       default: false,
//     },
//     top: {
//       type: Number,
//       default: 0,
//     },
//     left: {
//       type: Number,
//       default: 0,
//     },
//   },
//   setup() {},
// });
</script>

<style lang="postcss" scoped>
img {
  max-width: v-bind('width');
  max-height: v-bind('height');
}
</style>
