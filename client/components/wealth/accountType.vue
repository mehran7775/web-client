<template>
  <select-box :value="modelValue" :label="label" textPath="$.name" id="accountType">
    <template #items>
     <ul class="tw-m-0 tw-p-0">
      <li v-for="item in items" :key="item.id" class="tw-p-2 tw-cursor-pointer hover:tw-bg-primary-100"
      @click="$emit('update:modelValue', item as AutoCompleteItemInterface)"
      >
        <span v-text="item.name"></span>
      </li>
     </ul>
    </template>
  </select-box>
</template>
<script setup lang="ts">
import { AutoCompleteItem, AutoCompleteItemInterface, defaultWealthValidityItems } from "~/types";

withDefaults(defineProps<{
  modelValue?: AutoCompleteItemInterface | null,
  label?: string
}>(),{
  modelValue: ()=> new AutoCompleteItem("1", "نزد کارگزار"),
  label: ''
})

const emit = defineEmits(['update:modelValue'])

const items = [new AutoCompleteItem("1", "نزد کارگزار")];

</script>
