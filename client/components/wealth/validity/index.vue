<script setup lang="ts">
import { AutoCompleteItem } from "~/types";

const day = ref<string>('')
const month = ref<string>('')
const year = ref<string>('')

const items = [
  new AutoCompleteItem("1", "روز"),
  new AutoCompleteItem("4", "انجام و حذف"),
  new AutoCompleteItem("3", "تا لغو"),
  new AutoCompleteItem("2", "تا تاریخ"),
];

const window = computed(() => (value.value?.id == "2" ? "date" : "select"));
const value = ref<AutoCompleteItem | null>(items[0]);
//TODO emit update



const select = (item: AutoCompleteItem):void =>{
  value.value = item
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
      <select-box :value="value" keyPath="$.id" v-bind="$attrs" id="credit-wealth">
        <template #items>
          <ul class="tw-m-0 tw-p-0">
            <li v-for="item in items" :key="item.id" class="tw-p-2 tw-cursor-pointer hover:tw-bg-primary-100" @click="select(item)">
              <span v-text="item.name"></span>
            </li>
          </ul>
        </template>
      </select-box>
    </windows-item>
    <windows-item value="date" :selected="window">
      <date-input v-model:day="day" v-model:month="month" v-model:year="year">
        <template #append>
          <ada-btn @click="
            () => {
              value = items[0];
            }
          ">
            {{ $t("general.cancellation") }}
          </ada-btn>
        </template>
      </date-input>
    </windows-item>
  </Windows>
</template>
