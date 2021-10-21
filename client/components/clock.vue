<template>
  <div :style="{ width: width + 'px' }">
    {{ date.toFormat(format) }}
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  useStore,
  computed,
  ref,
} from "@nuxtjs/composition-api";
import { DateTime } from "luxon";

export default defineComponent({
  name: "clock",
  props: {
    format: String,
    width: Number,
  },
  setup() {
    const store = useStore();
    const locale = computed(() => {
      return store.getters["locale"];
    });
    const date = ref(DateTime.now().setLocale(locale.value));
    setInterval(() => {
      date.value = DateTime.now().setLocale(locale.value);
    }, 1000);
    return {
      date,
      DateTime,
    };
  },
});
</script>