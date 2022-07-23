<template>
  <!-- <div class="msgs">
    <div class="scroll">
      <v-list-item v-for="item in value" :key="item.id" @click="() => $emit('select', item.id)" dense>
        <ada-icon> {{ icons[item.origin] }} </ada-icon>
        <v-list-item-title class="ma-0 pa-0 ps-1">
          <ada-icon v-if="!item.seenDate" color="warning" :size="12">
            mdi-alert-circle
          </ada-icon>
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </div>
    <ada-btn @click="$emit('load', $event)" color="primary" :height="32" depressed class="more">
      <v-progress-circular size="26" indeterminate v-show="loading" />
      <ada-icon v-show="!loading"> mdi-dots-horizontal </ada-icon>
    </ada-btn>
  </div> -->
</template>
<script lang="ts">
import { defineComponent, Ref, ref, computed } from "#app";
import { DateTime } from "luxon";
import { Message } from "@/types";
import { useAsrTrader } from "~/composables";

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
    const appManager = useAsrTrader();
    const locale = appManager.locale;
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
.scroll {
  height: calc(100% - 32px);
  overflow-y: auto;
}

.scroll::-webkit-scrollbar {
  display: block;
}

.more {
  overflow: hidden;
  width: 100%;
}
</style>
