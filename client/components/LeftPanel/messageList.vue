<template>
  <div style="position: relative" class="flex-grow-1">
    <v-virtual-scroll class="scroll" item-height="32" :items="value">
      <template #default="{ item }">
        <v-list-item
          :key="item.id"
          @click="() => $emit('select', item.id)"
          dense
        >
          <v-icon> {{ icons[item.origin] }} </v-icon>
          <v-list-item-title class="ma-0 pa-0 ps-5">
            <v-icon v-if="!item.seenAt" color="warning" x-small>
              mdi-alert-circle
            </v-icon>
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
    <v-btn
      @click="$emit('load', $event)"
      color="primary"
      :height="32"
      depressed
      class="more"
    >
      <v-progress-circular size="26" indeterminate v-show="loading" />
      <v-icon v-show="!loading"> mdi-more </v-icon>
    </v-btn>
  </div>
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
  emits: ["select", "load"],
  props: {
    value: Array,
    timeFormat: String,
    iconParser: Function,
    loading: Boolean,
  },
  setup(props, context) {
    const store = useStore();
    const locale = computed(() => store.getters["locale"]);
    const icons = [
      "mdi-message-cog-outline",
      "mdi-message-flash-outline",
      "mdi-message-processing-outline",
      "mdi-message-alert-outline",
      "mdi-message-outline",
    ];
    return {
      locale,
      DateTime,
      icons,
    };
  },
});
</script>

<style scoped>
.more {
  overflow: hidden;
  width: 100%;
}
</style>