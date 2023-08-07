<script lang="ts" setup>
const appManager = useAsrTrader();
const rtl = computed(() => appManager.rtl);

const props = withDefaults(
  defineProps<{
    active: boolean;
  }>(),
  {
    active: false,
  }
);
</script>

<style lang="postcss" scoped></style>

<template>
  <Teleport to="body">
    <div v-if="active" class="modal"></div>
    <transition name="slide-bounce">
      <div v-if="active" :class="{ rtl: rtl }" class="dialog">
        <div class="dialog-container">
            <slot name="prepend"></slot>
            <slot></slot>
            <slot name="append"></slot>
        </div>
      </div>
    </transition>
  </Teleport>
</template>
