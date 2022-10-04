<script setup lang="ts">
import { Ref } from "vue";
const props = withDefaults(
  defineProps<{
    model?: any;
    type?: "button" | "submit" | "reset";
    icon?: boolean;
    to?: string;
  }>(),
  {
    type: "button",
    icon: false,
  }
);
const router = useRouter();

const value: Ref<any> = inject("toggle-ref", ref(null));
function click() {
  value.value = props.model;
  if (props.to)
    router.push(props.to)
}

</script>

<style lang="postcss" scoped>
.ada-button {
  @apply tw-font-bold tw-relative tw-text-ellipsis tw-rounded tw-bg-default tw-outline-none;

  &:disabled {
    @apply tw-bg-gray4 tw-text-gray-400 tw-opacity-20;
  }

  &.active::after {
    @apply tw-rounded tw-absolute tw-w-full tw-h-full;
    content: "";
    top: 0;
    left: 0;
    user-select: none;
    pointer-events: none;
  }

}
</style>

<template>
  <button class="ada-button" v-bind="$attrs" @click="
    () => {
      click();
    }
  " :class="[
  typeof props.model != 'undefined' && props.model == value ? 'active' : '',
]" :type="type">
    <slot></slot>
  </button>
</template>
