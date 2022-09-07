<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    label?: string;
    type?: string;
    modelValue?: string | number;
    min?: number | null;
    max?: number | null;
    minlength?: number | null;
    maxlength?: number | null;
    readonly?: boolean,
    maxWidth?: string,
    tabIndex?: string
  }>(),
  {
    label: "",
    type: "text",
    modelValue: "",
    min: null,
    max: null,
    minlength: null,
    maxlength: null,
    readonly: false,
    tabIndex: '0',
    height: 'auto'

  }
);

const emit = defineEmits(["update:modelValue", "keyup"]);

const ltr = computed<string>(() => (props.type == "number" ? "ltr" : ""));
const active = ref(false)

</script>

<style lang="postcss">
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
  @apply tw-whitespace-nowrap tw-min-w-0;

  &.has-label {
    .label {
      @apply tw-flex tw-items-center tw-text-black tw-overflow-clip tw-text-ellipsis tw-whitespace-nowrap;
      width: 96px;
    }

    input {
      margin: auto 0 auto 4px;
    }
  }

  &.active {
    .scaffold {
      @apply tw-border-primary tw-bg-white;
    }
  }

  .scaffold {
    @apply tw-flex tw-justify-between tw-align-middle tw-cursor-text tw-bg-primary/10 tw-overflow-clip;
    min-width: calc(100% - 96px);
    @apply tw-border tw-border-black/50 tw-rounded;

    input {
      @apply tw-rounded tw-min-w-0 tw-inline tw-flex-grow tw-min-h-0 tw-px-2;
      background: none;
      outline-style: none;
      line-height: inherit;
      font-size: inherit;
      font-weight: inherit;
      height: inherit;
    }
  }
}
</style>

<template>
  <label :class="['ada-input', active ? 'active' : '', label == '' ? '' : 'has-label']" tabindex="-1">
    <div class="label">
      {{ label }}
    </div>
    <div class="scaffold">
      <slot name="prepend" :active="active"> </slot>
      <input :type="type" @focus="() => { active = true }" @blur="() => { active = false }"
        @keyup.enter="$emit('keyup')" :value="modelValue" :class="[ltr]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        v-bind="{ min, max, minlength, maxlength, ...$attrs }" :readonly="readonly" :tabindex="tabIndex" />
      <slot name="append" :active="active"></slot>
    </div>

  </label>
</template>
