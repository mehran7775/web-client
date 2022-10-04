<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string;
    modelValue: number | string;
    min?: number | null;
    max?: number | null;
    minlength?: number | null;
    maxlength?: number | null;
    readonly?: boolean;
    maxWidth?: string;
    tabIndex?: string;
  }>(),
  {
    label: "",
    min: null,
    max: null,
    minlength: null,
    maxlength: null,
    readonly: false,
    tabIndex: "0",
    height: "auto",
  }
);

const emit = defineEmits(["update:modelValue"]);

const active = ref(false);
const join = (val: string): string=> {
  if (val.includes(",")) {
    return val.replace(/\,/gi, "");
  }
  return val
}

const reg = /^[a-zA-Z ]$/;

const validateInput = (e)=> {
  if(reg.test(e.key)) {
    e.preventDefault()
    e.stopPropagation();
    return false
  }

}


const separate = (val: string): string => {
  val += "";
  val = val.replace(",", "");
  let x = val.split(".");
  let y = x[0];
  let z = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(y)) y = y.replace(rgx, "$1" + "," + "$2");
  return y + z;
}

const separateValue = ref(separate(props.modelValue?.toString()))

watch(()=> props.modelValue , (newVal)=> {
  separateValue.value = separate(newVal.toString())
})

</script>

<style lang="postcss">
.ada-input {
  @apply tw-whitespace-nowrap tw-min-w-0 tw-w-full;

  &.has-label {
    .label {
      @apply tw-flex tw-items-center tw-text-black tw-overflow-clip tw-text-ellipsis tw-whitespace-nowrap;
      max-width: 65px;
    }
  }

  &.active {
    .scaffold {
      @apply tw-border-primary tw-bg-white;
    }
  }

  .scaffold {
    @apply tw-flex tw-justify-between tw-align-middle tw-cursor-text tw-bg-primary/10 tw-overflow-clip;
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
  <label
    :class="[
      'ada-input',
      active ? 'active' : '',
      label == '' ? '' : 'has-label',
    ]"
    tabindex="-1"
  >
    <div class="label">
      {{ label }}
    </div>
    <div class="scaffold">
      <slot name="prepend" :active="active"> </slot>
      <input
        type="text"
        @focus="active = true"
        @blur="active = false"
        :value="separateValue"
        class="ltr"
        @keypress="validateInput"
        @input="(e)=> emit('update:modelValue',join((e.target as HTMLInputElement).value))"
        v-bind="{ min, max, minlength, maxlength, ...$attrs }"
        :readonly="readonly"
        :tabindex="tabIndex"
      />
      <slot name="append" :active="active"></slot>
    </div>
  </label>
</template>
