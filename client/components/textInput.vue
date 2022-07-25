<script setup lang="ts">
import { computed, ref, watch, useSlots } from "#app";

const props = withDefaults(
  defineProps<{
    label: string;
    type: string;
    value: string | number;
    min: number | null;
    max: number | null;
    minlength: number | null;
    maxlength: number | null;
    rounded: string;
    bg: string;
    readonly: boolean,
    borderColor: string
    borderActive?: boolean,
  }>(),
  {
    label: "",
    type: "text",
    value: "",
    min: 1,
    max: 5,
    minlength: null,
    maxlength: null,
    rounded: "var(--border-radius-root)",
    bg: "tw-bg-white",
    readonly: false,
    borderColor: "tw-border-transparent",
    borderActive: false,
  }
);


///////////////

const emit = defineEmits(["input", "keyup:enter", 'focus']);

const ltr = computed<string>(() => (props.type == "number" ? "ltr" : ""));
const val = ref(props.value);
const active = ref(false)
const slots = useSlots()
const hasSlot = (name: string) => {
  return !!slots[name];
}



////////////

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
.template-input {
  .template-te {
    @apply tw-w-full tw-relative tw-flex tw-items-center tw-justify-between tw-h-full tw-rounded-md tw-border;
    @apply tw-py-1;

  }
  .input-feild {
    @apply tw-w-full tw-h-full tw-relative tw-py-3 tw-px-2;
    @apply  focus:tw-outline-none tw-rounded-md;
    color: inherit;
  }
}
</style>

<template>
  <div class="template-input" tabindex="-1">
    <label tabindex="-1" v-text="label" class="tw-block tw-my-2 tw-text-black"></label>
    <div class="template-te"
    :class="[ hasSlot('prepend') ? 'tw-pr-2' : null, hasSlot('append') ? 'tw-pl-2' : null, active ? 'tw-border-primary' : null, borderColor]"
    >
      <slot name="prepend" :active="active"></slot>
      <input class="input-feild" :type="type" @focus="() => { active = true, $emit('focus') }" @blur="() => { active = false }" @keyup.enter="$emit('keyup:enter')"
        v-model="val" :class="[ltr, bg]"
        @input="() => emit('input', type == 'number' ? parseInt(val) : val)"
        v-bind="{ min, max, minlength, maxlength, ...$attrs }" :readonly="readonly"/>
      <slot name="append"></slot>
    </div>
  </div>
</template>
