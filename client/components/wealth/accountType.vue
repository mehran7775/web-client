<template>
  <select-box v-bind="$attrs" :items="items" keyPath="$.id"> </select-box>
</template>
<script setup lang="ts">
import { AutoCompleteItem } from "~/types";

const items = [new AutoCompleteItem("1", "نزد کارگزار")];
</script>
