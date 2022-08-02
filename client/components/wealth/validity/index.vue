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
const value = ref<AutoCompleteItem | null>(items[0]);
//TODO emit update



const select = (item: AutoCompleteItem):void =>{
  value.value = item
}

</script>
<template>
  <Windows>
    <window value="select" :selected="window">
      <!-- <select-box v-bind="$attrs" :items="items" keyPath="$.id" v-model="value">
      </select-box> -->
      <select-box :value="value" keyPath="$.id" v-bind="$attrs" id="credit-wealth">
        <template #items>
          <ul class="tw-m-0 tw-p-0">
            <li v-for="item in items" :key="item.id" class="tw-p-2 tw-cursor-pointer hover:tw-bg-primary-100" @click="select(item)">
              <span v-text="item.name"></span>
            </li>
          </ul>
        </template>
      </select-box>
    </window>
    <window value="date" :selected="window">
      <DateInput>
        <template #append>
          <ada-btn @click="
            () => {
              value = null;
            }
          " color="error" :height="18" class="tw-mt-1 tw-px-5" dark>
            {{ $t("general.cancellation") }}
          </ada-btn>
        </template>
      </DateInput>
    </window>
  </Windows>
</template>
