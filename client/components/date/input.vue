<script setup lang="ts">
import moment from "jalali-moment"
import { useAsrTrader } from "~/composables";

const props = withDefaults(
  defineProps<{
    label?: string;
    modelValue?: string;
  }>(),
  {
    label: "",
    modelValue: "2020-01-01",
  }
);

const emit = defineEmits(["update:modelValue"]);

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
  emit("update:modelValue", moment(val.value, "jYYYY-jM/jD").format("YYYY-MM-DD"));
}

watch(
  () => props.modelValue,
  (update) => {
    val.value = update;
  }
);
</script>

<style lang="postcss" scoped>
.ada-input {
  @apply tw-flex tw-flex-grow tw-whitespace-nowrap tw-min-w-0;
  border-radius: var(--border-radius-input);

  .input-container {
    @apply tw-p-[4px] tw-min-w-0 tw-flex tw-flex-grow tw-justify-between;
    background-color: rgba(var(--c-primary), 0.1);
    border-radius: var(--border-radius-input);
  
    &:dir(rtl) {
      padding: 0 0 0 6px;
    }

    input {
      @apply tw-min-w-0 tw-inline;
      outline-style: none;
      line-height: inherit;
      font-size: inherit;
      padding: 0 3px 0 3px;
      background-color: white;
      border-radius: var(--border-radius-input);
      direction: ltr;

      &:nth-child(odd) {
        margin: 0 3px;
      }

      &:nth-child(2) {
        margin: 0;
      }
    }
  }

}
</style>


<template>
  <label class="ada-input">
    <div class="label">
      {{ label }}
    </div>
    <div class="input-container">
      <slot name="prepend"> </slot>
      <ada-input type="number" v-model="day" @input="change" :min="1" :max="31" />
      <ada-input type="number" v-model="month" @input="change" :min="1" :max="12" />
      <ada-input type="number" v-model="year" @input="change" :min="1400" :max="9999" />
      <slot name="append"></slot>
    </div>
  </label>
</template>
