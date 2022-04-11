<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "#app";

interface selectProps {
  label: string;
  placeholder: string;
  height: string;
  readonly: boolean;
  items: any;
  textPath: string;
  keyPath: string;
  value: any;
}

const props = withDefaults(defineProps<selectProps>(), {
  placeholder: "",
  label: "",
  height: "24px",
  items: [],
  readonly: false,
  textPath: "$.name",
  keyPath: "$.id",
  value: null,
});

const emit = defineEmits(["input"]);

const active = ref(false);
const selectedText = ref("");
const val = ref<string | null>(props.value);
const inp = ref<HTMLInputElement | null>(null);

watch(
  () => props.value,
  (update) => {
    if (update) select(update);
    else {
      selectedText.value = "";
      val.value = null;
    }
  }
);

function toggleActive() {
  active.value = !active.value;
}

function select(item: any) {
  val.value = item;
  emit("input", item);
  selectedText.value = getText(item);
  active.value = false;
}

const getText: (item: any) => string = eval(
  "(item)=>{\
    return " + props.textPath.replace(/^\$/, "item") + ".toString();\
  }"
);

const getValue: (item: any) => any = eval(
  "(item)=>{\
    return " + props.keyPath.replace(/^\$/, "item") + ";\
  }"
);
if (process.client) {
  function close(e: MouseEvent) {
    if (e.target != inp.value) active.value = false;
  }
  window.addEventListener("click", close);

  onBeforeUnmount(() => {
    window.removeEventListener("click", close);
  });
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
      val == null ? '' : 'value',
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
      v-model="selectedText"
      readonly
      ref="inp"
      :aria-readonly="readonly"
      :placeholder="placeholder"
    />
    <slot name="append">
      <i
        @click.prevent="toggleActive"
        class="isax isax-arrow-down tw-text-sm tw-my-auto tw-mx-2"
      ></i>
    </slot>
    <ol class="menu tw-m-0 tw-p-0 tw-shadow" v-show="active">
      <slot name="prepend-item"></slot>
      <li v-for="item in items" :key="getValue(item)" @click.prevent="() => select(item)">
        {{ getText(item) }}
      </li>
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
