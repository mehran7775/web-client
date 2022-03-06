<script setup lang="ts">
import { computed, ref } from "@nuxtjs/composition-api";

interface selectProps {
  label: string;
  placeholder: string;
  height: string;
  readonly: boolean;
  items: any;
}

const props = withDefaults(defineProps<selectProps>(), {
  placeholder: "",
  label: "",
  height: "24px",
  items: [],
  readonly: false,
});

const active = ref(false);
const value = ref<string | null>(null);

function toggleActive() {
  active.value = !active.value;
}

function select(item: any) {
  value.value = item;
  active.value = false;
}
</script>

<template>
  <label
    :class="[
      'ada-select',
      'tw-flex',
      'tw-min-w-0',
      'tw-whitespace-nowrap',
      active ? 'active' : 'inactive',
      value == null ? '' : 'value',
    ]"
    :style="{ height: height }"
    @click="toggleActive"
  >
    <slot name="prepend">
      {{ label }}
    </slot>
    <input
      type="text"
      class="tw-min-w-0 tw-max-w-full tw-h-full tw-flex-grow tw-px-2 tw-inline-block"
      v-model="value"
      readonly
      :aria-readonly="readonly"
    />
    <slot name="append">
      <i class="isax isax-arrow-down tw-text-sm tw-my-auto tw-mx-2"></i>
    </slot>
    <ol class="menu tw-m-0 tw-p-0 tw-shadow" v-show="active">
      <slot name="prepend-item"></slot>
      <li v-for="item in items" @click="() => select(item)">{{ item }}</li>
      <slot name="append-item"></slot>
    </ol>
  </label>
</template>

<style lang="postcss" scoped>
.ada-select {
  position: relative;
  border-radius: var(--border-radius-input);
  background-color: rgba(var(--c-primary), 0.1);
  color: var(--c-primary-rgb);
  cursor: pointer;
  &.value {
    background-color: var(--c-primary-rgb);
    input,
    i {
      color: white;
    }
  }
  &.active {
    i {
      transform: rotate(-180deg);
    }
  }
  input {
    background-color: transparent;
    outline-style: none;
    line-height: 0.83334rem !important;
    font-size: 0.83334rem;
    border-radius: var(--border-radius-input);
    cursor: inherit;
  }
}
.menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 999999;
  min-width: 100%;
  background-color: white;
  padding: 0 !important;
  li {
    display: block;
    list-style: none;
    padding: 0 6px 0 6px;
    &:hover {
      background-color: rgba(var(--c-primary), 0.05);
    }
  }
}
</style>
