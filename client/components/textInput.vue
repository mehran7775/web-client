<script setup lang="ts">
import { computed, ref, watch } from "#app";

const props = withDefaults(
  defineProps<{
<<<<<<< HEAD
    label: string;
    type: string;
    value: string | number;
    min: number | null;
    max: number | null;
    minlength: number | null;
    maxlength: number | null;
    rounded: string;
    bg: string;
    activeBorder: boolean;
    readonly: boolean,
    tabIndex: string,
    height: string
=======
    label?: string;
    type?: string;
    value?: string | number;
    min?: number | null;
    max?: number | null;
    minlength?: number | null;
    maxlength?: number | null;
    rounded?: string;
    bg?: string;
    activeBorder?: boolean;
    readonly?: boolean,
    borderColor?: string,
    maxWidth?: string,
    tabIndex?: string,
    height?: string
>>>>>>> e6c2554b708453ff92a9005b37b33f79ef52dcf8
  }>(),
  {
    label: "",
    type: "text",
    value: "",
    min: null,
    max: null,
    minlength: null,
    maxlength: null,
    rounded: "var(--border-radius-root)",
    bg: "rgba(var(--c-primary), 0.1)",
    activeBorder: false,
    readonly: false,
    tabIndex: '0',
    height: 'auto'

  }
);

const emit = defineEmits(["input", "keyup"]);

const ltr = computed<string>(() => (props.type == "number" ? "ltr" : ""));
const val = ref(props.value);
const active = ref(false)

function setValue(update: string | number) {
  val.value = update;
}

watch(
  () => props.value,
  (update) => {
    setValue(update);
  }
);
</script>

<style lang="postcss" scoped>
.rtl {
  .ada-input {
    &.has-label {
      input {
        margin: auto 4px auto 0;
      }
    }
  }
}

.ada-input {
  @apply tw-flex tw-flex-grow tw-items-center tw-justify-between tw-whitespace-nowrap tw-min-w-0;

  &.has-label {
    .label {
      @apply tw-flex tw-items-center tw-text-black;
      width: 96px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    input {
      margin: auto 0 auto 4px;
    }
  }

  .scaffold {
    @apply tw-cursor-text;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: calc(100% - 96px);
   

    input {
      @apply tw-min-w-0 tw-inline tw-flex-grow tw-min-h-0;
      outline-style: none;
      line-height: inherit;
      font-size: inherit;
      font-weight: inherit;
      padding: 0 6px 0 6px;

      &.active-border:focus {
        background-color: white;
        border: solid 1px var(--c-primary-rgb);
        color: var(--c-primary-rgb);
      }

    }
  }
}
</style>

<template>
  <label :class="['ada-input', active ? 'active' : '', label == '' ? '' : 'has-label']" tabindex="-1">
    <div :class="['label']">
      {{ label }}
    </div>
    <div class="scaffold" :class="{ 'active': active }" :style="{ borderRadius: rounded }">
      <slot name="prepend" :active="active"> </slot>
      <input :type="type" @focus="() => { active = true }" @blur="() => { active = false }"
        @keyup.enter="$emit('keyup')" :style="{
          backgroundColor: bg,
          borderRadius: rounded,
          height: height
        }" v-model="val" :class="[ltr, activeBorder ? 'active-border' : '']"
        @input="() => emit('input', type == 'number' ? parseInt(val) : val)"
        v-bind="{ min, max, minlength, maxlength, ...$attrs }" :readonly="readonly" :tabindex="tabIndex" />
      <slot name="append"></slot>
    </div>

  </label>
</template>
