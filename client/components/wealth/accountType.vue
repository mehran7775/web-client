<template>
  <select-box v-bind="$attrs" :items="items" keyPath="$.id" v-model="value"> </select-box>
</template>
<script setup lang="ts">
import { ref } from '#app'
import { AutoCompleteItem } from "~/types";

const items = [new AutoCompleteItem("1", "نزد کارگزار")];
const value = ref<AutoCompleteItem | null>(items[0])
</script>
