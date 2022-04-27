<script setup lang="ts">
import { computed, ref, watch } from "#app";

const props = withDefaults(
  defineProps<{
    label: string;
    type: string;
    value: string | number;
    min: number | null;
    max: number | null;
    minlength: number | null;
    maxlength: number | null;
  }>(),
  {
    label: "",
    type: "text",
    value: "",
    min: null,
    max: null,
    minlength: null,
    maxlength: null,
  }
);

const emit = defineEmits(["input"]);

const ltr = computed<string>(() => (props.type == "number" ? "ltr" : ""));
const val = ref(props.value);

function setValue(update: any) {
  val.value = update;
}

watch(
  () => props.value,
  (update) => {
    setValue(update);
  }
);
</script>

<template>
  <label class="ada-input">
    <div class="label">
      {{ label }}
    </div>
    <slot name="prepend"> </slot>
    <input
      :type="type"
      v-model="val"
      :class="[ltr]"
      @input="() => emit('input', type == 'number' ? parseInt(val) : val)"
      v-bind="{ min, max, minlength, maxlength }"
    />
    <slot name="append"></slot>
  </label>
</template>

<style lang="postcss" scoped>
.ada-input {
  @apply tw-flex tw-flex-grow tw-justify-between tw-whitespace-nowrap tw-min-w-0;
  height: 24px;
  input {
    @apply tw-min-w-0 tw-inline;
    outline-style: none;
    line-height: 0.83334rem !important;
    height: 24px;
    font-size: 0.83334rem;
    font-weight: bold;
    margin: auto 4px auto 4px;
    padding: 0 6px 0 6px;
    background-color: rgba(var(--c-primary), 0.1);
    border-radius: var(--border-radius-root);
    width: 60%;
    &:focus {
      background-color: white;
      border: solid 1px var(--c-primary-rgb);
      color: var(--c-primary-rgb);
    }
  }
}
</style>
