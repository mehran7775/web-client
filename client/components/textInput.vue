<script setup lang="ts">
import { computed, ref, watch } from "#app";
const props = withDefaults(
  defineProps<{
    label: string;
    type: string;
    value: string | number;
  }>(),
  {
    label: "",
    type: "text",
    value: "",
  }
);

const emit = defineEmits(["input"]);

const ltr = computed<boolean>(() => {
  return props.type == "number";
});
const val = ref(props.value);

watch(
  () => props.value,
  (update) => {
    val.value = update;
  }
);
</script>

<template>
  <label class="ada-input tw-flex tw-whitespace-nowrap tw-min-w-0">
    <div class="label">
      {{ label }}
    </div>
    <div class="input-container tw-min-w-0 tw-flex">
      <slot name="prepend"> </slot>
      <input
        :type="type"
        :class="['tw-min-w-0', 'tw-inline', ltr ? 'ltr' : '']"
        v-model="val"
        @input="(data) => emit('input', val)"
      />
      <slot name="append"></slot>
    </div>
  </label>
</template>

<style lang="postcss" scoped>
.ada-input {
  height: 24px;
  border-radius: var(--border-radius-input);
  .input-container {
    background-color: rgba(var(--c-primary), 0.1);
    border-radius: var(--border-radius-input);
    margin: 0 0 0 5px;
    padding: 0 6px 0 0;
    &:dir(rtl) {
      margin: 0 5px 0 0;
      padding: 0 0 0 6px;
    }
  }
  input {
    outline-style: none;
    line-height: 0.83334rem !important;
    height: 16px;
    font-size: 0.83334rem;
    margin: auto 4px auto 4px;
    padding: 0 6px 0 6px;
    background-color: white;
    border-radius: var(--border-radius-input);
  }
}

.rtl {
  .ada-input {
    .input-container {
      margin: 0 5px 0 0;
      padding: 0 0 0 6px;
    }
  }
}
</style>
