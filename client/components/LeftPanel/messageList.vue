<template>
  <v-virtual-scroll item-height="40" :items="value">
    <template #default="{ item }">
      <v-list-item :key="item.id" @click="() => {}" dense>
        <v-list-item-icon>
          <v-icon> {{ icon(item) }} </v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ item.title }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{
            DateTime.fromISO(item.dateTime)
              .setLocale(locale)
              .toFormat(timeFormat)
          }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>
  </v-virtual-scroll>
</template>
<script lang="ts">
import {
  defineComponent,
  Ref,
  ref,
  computed,
  useStore,
} from "@nuxtjs/composition-api";
import { DateTime } from "luxon";
import { Message } from "@/types";

function defaultIconParser(message: Message): string {
  if ((message.flags & 1) == 1) return "mdi-email-open";
  else return "mdi-email-outline";
}

export default defineComponent({
  name: "message-list",
  emits: ["select"],
  props: {
    value: Array,
    timeFormat: String,
    iconParser: Function,
  },
  setup(props, context) {
    const store = useStore();
    const locale = computed(() => store.getters["locale"]);
    const icon = props.iconParser ?? defaultIconParser;
    return {
      locale,
      DateTime,
      icon,
    };
  },
});
</script>
