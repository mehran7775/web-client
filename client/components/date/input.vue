<script setup lang="ts">
import moment from "jalali-moment"
import { useAsrTrader } from "~/composables";

const props = withDefaults(
  defineProps<{
    label?: string;
    day: string
    month: string
    year: string
  }>(),
  {
    label: ""
  }
);


const reg = /^[a-zA-Z ]$/;


const emit = defineEmits(['update:day', 'update:month', 'update:year'])

const active = ref<boolean>(false)


const cDay = computed({
  get() {
    return props.day
  },
  set(val: string) {
    emit('update:day', val)
  }
})

const cMonth = computed({
  get() {
    return props.month
  },
  set(val: string) {
    emit('update:month', val)
  }
})

const cYear = computed({
  get() {
    return props.year
  },
  set(val: string) {
    emit('update:year', val)
  }
})



///////functions////////////

const dayValidate = (e)=> {
  const val =parseInt(cDay.value.concat(e.key))
  if(reg.test(e.key) || val > 31) {
    prevent(e)
  }
}

const monthValidate = (e)=> {
  const val =parseInt(cMonth.value.concat(e.key))
  if(reg.test(e.key) || val > 12) {
    prevent(e)
  }
}

const yearValidate = (e)=> {
  const val =parseInt(cYear.value.concat(e.key))
  if(reg.test(e.key) || val > 1450) {
    prevent(e)
  }
}


const prevent = (e)=> {
    e.preventDefault()
    e.stopPropagation();
    return false
}

</script>

<style lang="postcss" scoped>
.ada-input {
  @apply tw-flex tw-whitespace-nowrap tw-min-w-0 tw-mx-auto tw-items-center;

  .input-container {
    @apply tw-flex tw-justify-center tw-bg-primary/10 tw-text-primary tw-rounded tw-max-w-full tw-items-center;
    input {
      @apply tw-min-w-0 tw-w-10 tw-text-center tw-bg-transparent tw-text-inherit tw-py-[4px];
      outline-style: none;
      line-height: inherit;
      font-size: inherit;
      direction: ltr; 
      &:nth-child(5) {
        @apply tw-w-16;
      }
    }
    ::placeholder {
      @apply tw-text-primary/30;
    }
    
    >span {
      @apply tw-text-primary/60;
    }
  }

}
</style>


<template>
  <label class="ada-input">
    <div class="label">
      {{ label }}
    </div>
    <slot name="prepend"> </slot>
    <div class="input-container" :class="{ active: active }">
      <input type="text" v-model="cDay"  maxlength="2" min="1" max="31" @keypress="dayValidate" placeholder="01"
      @focus="active = true" @blur="active = false"
      ><span>/</span>
      <input type="text" v-model="cMonth" maxlength="2" min="1" max="12" @keypress="monthValidate" placeholder="01"
      @focus="active = true" @blur="active = false"
      ><span>/</span>
      <input type="text" v-model="cYear" maxlength="4" min="1" max="1500" @keypress="yearValidate" placeholder="1400"
      @focus="active = true" @blur="active = false"
      >
    </div>
    <slot name="append"></slot>
  </label>
</template>
