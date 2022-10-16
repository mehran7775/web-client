<script setup lang="ts">
import { AutoCompleteItem, AutoCompleteItemInterface } from "~/types";
import { useAsrTrader } from "~~/composables";
import moment from 'jalali-moment'


const props = defineProps<{
  validityDate: string,
  validityType: number

}>()

const emit = defineEmits(['update:validityDate', 'update:validityType'])
const app = useAsrTrader();

const day = ref<string>('')
const month = ref<string>('')
const year = ref<string>('')

const items = [
  new AutoCompleteItem("1", "روز"),
  new AutoCompleteItem("4", "انجام و حذف"),
  new AutoCompleteItem("3", "تا لغو"),
  new AutoCompleteItem("2", "تا تاریخ"),
];


const selected = computed(()=> items.find((item)=> Number(item.id) === props.validityType))
const window = computed(() => (props.validityType === 2 ? "date" : "select"))


watch(()=> [ year.value, month.value, day.value ], ([ newYear, newMonth, newDay ])=> {
  const shamsi = `${ newYear }-${ newMonth }-${ newDay }`
  const mildai = moment.from(shamsi, app.locale.split('-')[0], 'YYYY/MM/DD')
  const res = mildai.format("YYYY-MM-DDTHH:mm:ss.z")
  res !== "Invalid date" ? emit('update:validityDate', res) : emit('update:validityDate', "")
})



const selectItem = (item: AutoCompleteItemInterface)=> {
  emit('update:validityType', Number(item.id))
}

</script>

<style lang="postcss" scoped>
.window {
  .ada-input {
    @apply tw-justify-between;
    & :deep(.input-container) {
      @apply tw-font-bold;
      width: calc(100% - 50px);
    }
    .ada-button {
    @apply tw-bg-error tw-text-white tw-m-0 tw-px-5 tw-w-14 tw-h-full;
  }
  }
  
 
}
</style>

<template>
  <Windows>
    <windows-item value="select" :selected="window">
      <select-box :value="selected" keyPath="$.id" v-bind="$attrs" id="credit-wealth">
        <template #items>
          <ul class="tw-m-0 tw-p-0">
            <li v-for="item in items" :key="item.id" class="tw-p-2 tw-cursor-pointer hover:tw-bg-primary-100" @click="selectItem(item)">
              <span v-text="item.name"></span>
            </li>
          </ul>
        </template>
      </select-box>
    </windows-item>
    <windows-item value="date" :selected="window">
      <date-input v-model:day="day" v-model:month="month" v-model:year="year">
        <template #append>
          <ada-btn @click.stop="emit('update:validityType', 1)">
            {{ $t("general.cancellation") }}
          </ada-btn>
        </template>
      </date-input>
    </windows-item>
  </Windows>
</template>
