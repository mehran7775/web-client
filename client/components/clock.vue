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
import { useAsrTrader } from "~/composables";


export default defineComponent({
  name: "clock",
  props: {
    format: String,
    width: [String, Number],
  },
  setup() {
    const store = useStore();
    const appManager = useAsrTrader(store);
    const locale = appManager.locale;
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