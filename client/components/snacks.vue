<script setup lang="ts">
import { ref, computed } from "#app";
import { useSnacks } from "@/composables";
import { Snack } from "@/types/stores"

const snackManager = useSnacks();
const snacks = computed(() => snackManager.state.Snacks)

function close(snack: Snack) {
  snackManager.close(snack);
}

function bgColor(color: string | undefined) {
  if (color) {
    let tmp = color.split(" ");
    if (tmp.length == 1) return "var(--c-" + tmp[0] + "-rgb)";
    else return "rgba(var(--c-" + tmp[0] + "), " + tmp[1] + ")";
  }
  return "rgba(var(--c-info),0.75)";
};

</script>

<style lang="postcss" scoped>
.snacks {
  @apply tw-absolute tw-flex tw-flex-col-reverse tw-w-[300px] tw-bg-transparent;
  right: calc(100% - 350px);
  bottom: 64px;
  max-height: 50vh;
  overflow-y: auto;

  .snack {
    @apply tw-min-h-fit tw-w-full tw-mb-2 tw-p-2 tw-pt-3;
    @apply tw-transition-all tw-ease-in-out tw-duration-500;
    border-radius: var(--border-radius-root);

    &-enter-active,
    &-leave-active {
      transition: all 0.5s ease;
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;
      transform: translateX(30px);
    }

    .actions {
      @apply tw-flex tw-flex-row tw-justify-end tw-mt-2;
    }
  }
}
</style>

<template>
  <TransitionGroup tag="dialog" name="snack" class="snacks">
    <div class="snack" v-for="snack in snacks" :key="snack.content" :style="{
      backgroundColor: bgColor(snack.bg),
      color: 'var(' + snack.color + ')'
    }">
      <h4>{{ $t(snack.content) }}</h4>
      <div class="actions">
        <slot name="actions">
          <ada-btn :height="24" :width="45" color="success" @click="() => close(snack)">
            {{ $t("general.ok") }}
          </ada-btn>
        </slot>
      </div>
    </div>
  </TransitionGroup>
</template>
