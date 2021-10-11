<template>
  <span>
    {{ moment(date).locale(locale).format($t("general.date.longdt")) }}
  </span>
</template>

<script lang="ts">
import {
  defineComponent,
  useStore,
  computed,
  ref,
} from "@nuxtjs/composition-api";
import moment from "moment-jalaali";

export default defineComponent({
  name: "clock",
  setup() {
    moment.loadPersian();
    const store = useStore();
    const date = ref(Date());
    setInterval(() => {
      date.value = Date();
    }, 1000);
    const locale = computed(() => {
      return store.getters["locale"];
    });
    return {
      date,
      moment,
      locale,
    };
  },
});
</script>

