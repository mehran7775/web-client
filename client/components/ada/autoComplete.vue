<script setup lang="ts">
import { AutoCompleteItem } from "@/types";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    loading: boolean;
    suggestions: AutoCompleteItem[] | [];

  }>(),
  {
    modelValue: "",
    placeholder: ""
  }
);

const emit = defineEmits(["update:modelValue", "select_item"]);

const active_menu = computed(() => {
  if (props.loading || props.suggestions.length || props.modelValue != ""){
    clickOutside.value = true
    return true; 
  }
  return false;
});
const clickOutside = ref<boolean>(true)
</script>

<style lang="postcss" scoped>
.auto-complete {
  @apply tw-relative tw-z-50 tw-h-[28px] tw-px-2 tw-pt-[2px] tw-bg-primary tw-bg-opacity-10 tw-rounded tw-overflow-hidden;
  .body {
    @apply tw-flex tw-items-center tw-h-full;
    input {
      @apply tw-w-full tw-border-none tw-p-1 tw-bg-inherit;

      &:focus {
        @apply tw-outline-none tw-border-[1.5px];
      }

      &::placeholder {
        @apply tw-text-primary;
      }
    }
  }

  &.active {
    @apply tw-rounded-b-none;
  }
}
</style>

<template>
  <div
    class="auto-complete"
    :class="{ active: active_menu }"
    v-ada-click-outside="()=> clickOutside = false"
  >
    <slot name="lable"></slot>
    <div class="body">
      <slot name="prepend"></slot>
      <ada-menu :active="active_menu && clickOutside" :mTop="32" :mLeft="20">
        <template #activator>
          <input
            type="text"
            id="text-auto-complete"
            :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            v-bind="{ ...$attrs }"
            :placeholder="placeholder"
            autocomplete="false"
          />
        </template>
        <template #items>
          <div>
            <ul class="tw-p-0 tw-m-0 tw-text-black tw-bg-white tw-shadow-lg">
              <template v-if="props.loading">
                <li class="tw-px-1 tw-py-2" v-text="$t('general.waiting')"></li>
              </template>
              <template v-else-if="props.suggestions.length">
                <li
                  v-for="item in props.suggestions"
                  :key="item.id"
                  class="hover:tw-bg-primary hover:tw-bg-opacity-10 tw-cursor-pointer tw-px-1 tw-py-2"
                  @click="$emit('select_item', item)"
                >
                  <span v-html="item.fullName"></span>
                </li>
              </template>
              <template v-else-if="modelValue != ''">
                <li
                  class="tw-px-1 tw-py-2"
                  v-text="$t('general.notFound')"
                ></li>
              </template>
            </ul>
          </div>
        </template>
      </ada-menu>
    </div>
    <slot name="append"></slot>
  </div>
</template>
