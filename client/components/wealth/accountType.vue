<template>
  <select-box height="28px" :value="value" :label="label" textPath="$.name" id="accountType">
    <template #items>
     <ul class="tw-m-0 tw-p-0">
      <li v-for="item in items" :key="item.id" class="tw-p-2 tw-cursor-pointer hover:tw-bg-primary-100">
        <span v-text="item.name"></span>
      </li>
     </ul>
    </template>
  </select-box>
</template>
<script setup lang="ts">
import { ref, watch } from '#app'
import { AutoCompleteItem } from "~/types";

withDefaults(defineProps<{
  value?: any,
  label?: string
}>(),{
  value: '',
  label: ''
})

const items = [new AutoCompleteItem("1", "نزد کارگزار")];
const value = ref<AutoCompleteItem | null>(items[0])


function select(val: any) {
 console.log(val)
}

watch(value, select);
</script>
