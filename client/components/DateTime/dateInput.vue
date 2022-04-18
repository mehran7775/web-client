<script setup lang="ts">
import { computed, ref, watch } from "#app";
import moment from "jalali-moment";
import { useAsrTrader } from "~/composables";

const props = withDefaults(
  defineProps<{
    label: string;
    value: string;
  }>(),
  {
    label: "",
    value: "2020-01-01",
  }
);

const emit = defineEmits(["input"]);

const appManager = useAsrTrader();
const locale = appManager.locale;
const day = ref(1);
const month = ref(1);
const year = ref(1400);
const val = computed({
  get() {
    return year.value + "-" + month.value + "-" + day.value;
  },
  set(value: string) {
    const tmp = value.split("-");
    year.value = parseInt(tmp[0]);
    month.value = parseInt(tmp[1]);
    day.value = parseInt(tmp[2]);
  },
});

function change() {
  emit("input", moment(val.value, "jYYYY-jM/jD").format("YYYY-MM-DD"));
}

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
        type="number"
        class="tw-min-w-0 tw-inline ltr"
        v-model="day"
        @input="change"
        :min="1"
        :max="31"
      />
      <input
        type="number"
        class="tw-min-w-0 tw-inline ltr"
        v-model="month"
        @input="change"
        :min="1"
        :max="12"
      />
      <input
        type="number"
        class="tw-min-w-0 tw-inline ltr"
        v-model="year"
        @input="change"
        :min="1400"
        :max="9999"
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
    padding: 0 4px 0 4px;
    &:dir(rtl) {
      padding: 0 0 0 6px;
    }
  }
  input {
    outline-style: none;
    line-height: 0.83334rem !important;
    height: 16px;
    font-size: 0.83334rem;
    padding: 0 3px 0 3px;
    background-color: white;
    border-radius: var(--border-radius-input);
  }
  input:nth-child(odd) {
    margin: auto 3px auto 3px;
  }
  input:nth-child(2) {
    margin: auto 0 auto 0;
  }
}

.rtl {
  .ada-input {
    .input-container {
      padding: 0 0 0 6px;
    }
  }
}
</style>
