<script setup lang="ts">
import { ref, computed, watch } from "#app";
import { AutoCompleteItem } from "~/types";
import Window from "~~/components/windows/window.vue";
import Windows from "~~/components/windows/index.vue";
import DateInput from "../../DateTime/dateInput.vue";

const items = [
  new AutoCompleteItem("1", "روز"),
  new AutoCompleteItem("2", "انجام و حذف"),
  new AutoCompleteItem("3", "تا لغو"),
  new AutoCompleteItem("4", "تا تاریخ"),
];

const window = computed(() => (value.value?.id == "4" ? "date" : "select"));
const value = ref<AutoCompleteItem | null>();
//TODO emit update
</script>
<template>
  <Windows>
    <window value="select" :selected="window">
      <select-box v-bind="$attrs" :items="items" keyPath="$.id" v-model="value">
      </select-box>
    </window>
    <window value="date" :selected="window">
      <DateInput>
        <template #append>
          <v-icon
            @click="
              () => {
                value = null;
              }
            "
            color="error"
            size="16"
          >
            mdi-close
          </v-icon>
        </template>
      </DateInput>
    </window>
  </Windows>
</template>
