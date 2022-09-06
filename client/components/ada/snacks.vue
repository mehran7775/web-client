<script setup lang="ts">
import { ref, computed } from "vue";
import { useSnacks } from "@/composables";
import { Snack } from "@/types/stores"

const snackManager = useSnacks();
const snacks = computed(() => snackManager.state.Snacks)

function close(snack: Snack) {
  snackManager.close(snack);
}
</script>

<style lang="postcss" scoped>
.snacks {
  @apply tw-absolute tw-flex tw-flex-col-reverse tw-w-[300px] tw-bg-transparent;
  right: calc(100% - 380px);
  bottom: 64px;
  max-height: 50vh;
  overflow-y: auto;

  .snack {
    @apply tw-min-h-fit tw-w-full tw-mb-2 tw-p-2 tw-pt-3 tw-bg-opacity-80 tw-rounded;
    @apply tw-transition-all tw-ease-in-out tw-duration-500;

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

      .ada-button {
        @apply tw-text-current tw-bg-transparent;
      }
    }
  }
}
</style>

<template>
  <TransitionGroup tag="dialog" name="snack" class="snacks">
    <div class="snack" v-for="snack in snacks" :key="snack.content" 
    :class="[`tw-bg-${ snack.bg ?? 'primary' }`, `tw-text-${ snack.color ?? 'white' }`]">
      <h4>{{ $t(snack.content) }}</h4>
      <div class="actions">
        <slot name="actions">
          <ada-btn @click="() => close(snack)">
            {{ $t("general.ok") }}
          </ada-btn>
        </slot>
      </div>
    </div>
  </TransitionGroup>
</template>
