<script setup lang="ts">
import { ref, computed, watch } from "#app";
import { AutoCompleteItem } from "~/types";
import Window from "~~/components/windows/window.vue";
import Windows from "~~/components/windows/index.vue";
import DateInput from "../../DateTime/dateInput.vue";

const items = [
  new AutoCompleteItem("1", "روز"),
  new AutoCompleteItem("4", "انجام و حذف"),
  new AutoCompleteItem("3", "تا لغو"),
  new AutoCompleteItem("2", "تا تاریخ"),
];

const window = computed(() => (value.value?.id == "2" ? "date" : "select"));
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
          <ada-btn
            @click="
              () => {
                value = null;
              }
            "
            color="error"
            :height="18"
            class="tw-mt-1 tw-px-5"
            dark
          >
            {{ $t("general.cancellation") }}
          </ada-btn>
        </template>
      </DateInput>
    </window>
  </Windows>
</template>
