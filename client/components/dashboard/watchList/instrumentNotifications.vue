<script setup lang="ts">
import { InstrumentCache, MessageOrigin } from "@/types";
import {
  useNotifications,
  useBottomPanel,
  useInstrument,
  useMessages,
} from "@/composables";

const props = defineProps<{
  value: InstrumentCache;
}>();

const notifManager = useNotifications();
const panelManager = useBottomPanel();
const instrumentManager = useInstrument();
const messageManager = useMessages();
const appManager = useAsrTrader();

const formatter = appManager.formatter;
const notifs = computed(
  () => notifManager.state.cache[props.value.instrumentCode]
);

function openMsg(n: number) {
  let code = null;
  switch (n) {
    case 1: {
      code = "RLC";
      break;
    }
    case 2: {
      code = "SUPPORT";
      break;
    }
    case 3: {
      code = "ADMIN";
      break;
    }
    case 4: {
      code = "TEDAN";
      break;
    }
    case 5: {
      code = "CODAL";
      break;
    }
    default: {
      code = "RLC";
    }
  }
  messageManager.activeAxactCategory(code);
  instrumentManager.select(props.value);
  panelManager.LeftPanelMini = false;
}

const calculateColor = (value: MessageOrigin) => {
  if (value == MessageOrigin.rlc) {
    return "primary";
  } else if (value == MessageOrigin.support) {
    return "success";
  } else if (value == MessageOrigin.tedan) {
    return "error";
  } else if (value == MessageOrigin.codal) {
    return "info";
  }
};

const calculateType = (n: MessageOrigin): string => {
  if (n == MessageOrigin.rlc) {
    return "categories.marketModerator";
  } else if (n == MessageOrigin.support) {
    return "categories.news";
  } else if (n == MessageOrigin.tedan) {
    return "categories.tedan";
  } else if (n == MessageOrigin.codal) {
    return "categories.codal";
  }
};
</script>

<style lang="postcss" scoped>
div {
  @apply tw-px-1 tw-flex tw-justify-center tw-items-center tw-max-h-full;
}
</style>
<template>
  <div v-if="notifs && notifs.length > 0">
    <ada-tooltip v-for="(not, i) in notifs" :key="i" position="above">
      <template #activator>
        <ada-icon
          @click.stop.prevent="openMsg(not.params.origin)"
          :class="[`tw-text-${calculateColor(not.params.origin)}`, 'tw-mx-1']"
          :size="16"
        >
          <span v-if="not.params.origin == MessageOrigin.rlc">lotfi-sms</span>
          <span v-else-if="not.params.origin == MessageOrigin.support"
            >isax-note-favorite-outline</span
          >
          <span v-else-if="not.params.origin == MessageOrigin.tedan"
            >isax-messages-3-outline</span
          >
          <span v-else>isax-document-text-outline</span>
        </ada-icon>
      </template>
      <span class="tw-flex">
        <span v-text="$t(calculateType(not.params.origin))"> </span>
        <span v-text="formatter.format(not.params.messagesCount)" class="tw-pl-1"></span>
      </span>
    </ada-tooltip>
  </div>
</template>
