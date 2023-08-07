<script lang="ts" setup>
import { useAsrTrader } from "~/composables";
import { MessageOrigin } from "@/types/message";

/////
const props = withDefaults(
  defineProps<{
    id?: number;
    dateTime?: string | null;
    title?: string;
    preview?: string;
    origin?: number;
    type?: number;
    flags?: number;
    message?: string;
    seenDate?: string | null;
  }>(),
  {
    dateTime: null,
    seenDate: null,
  }
);

const emits = defineEmits(["triggerShowMessage"]);

/////

const appManager = useAsrTrader();
const locale = appManager.locale;
const date = () => {
  return new Date(props.dateTime!.split("T")[0]).toLocaleDateString(locale);
};


//////

function show_message() {
  const item = {
    id: props.id,
    dateTime: props.dateTime,
    title: props.title,
    preview: props.preview,
    origin: props.origin,
    type: props.type,
    flags: props.flags,
    message: props.message,
    seenDate: props.seenDate,
  };
  emits("triggerShowMessage", item);
}

function calculateTextColorIcon(value: MessageOrigin) {
  if (props.seenDate) {
    return "gray4";
  } else {
    if (value == MessageOrigin.rlc) {
      return "primary";
    } else if (value == MessageOrigin.support) {
      return "info";
    } else if (value == MessageOrigin.tedan) {
      return "error";
    } else if (value == MessageOrigin.codal) {
      return "success";
    }
  }
}

function setName(value: MessageOrigin) {
    if (value == MessageOrigin.rlc) {
      return "lotfi-sms";
    } else if (value == MessageOrigin.support) {
      return "isax-note-favorite-outline";
    } else if (value == MessageOrigin.tedan) {
      return "isax-messages-3-outline";
    } else if (value == MessageOrigin.codal) {
      return "isax-document-text-outline";
    }
}
</script>

<style lang="postcss" scoped>
.message {
  .template {
    @apply tw-flex tw-items-center tw-font-normal tw-rounded-none tw-h-full tw-pt-1 tw-mt-[1px] tw-mx-auto;
    width: 94%;

    h4,
    p {
      @apply tw-text-ellipsis tw-whitespace-nowrap tw-overflow-hidden;
    }
  }
}
</style>

<template>
  <div class="message" v-bind="$attrs" @click="show_message()">
    <ada-btn color="transparent" class="template">
      <ada-icon
        :size="26"
        :class="`tw-text-${calculateTextColorIcon(origin)} tw-mt-3`"
        >{{ setName(origin) }}</ada-icon
      >
      <div class="tw-mr-2 tw-w-5/6">
        <div class="tw-flex tw-items-center tw-justify-between">
          <h4 :class="[seenDate ? 'tw-text-gray3' : 'tw-text-primary' ,'tw-text-lg']" v-text="title"></h4>
          <span :class="[seenDate ? 'tw-text-gray4' : 'tw-text-gray3']" v-text="date()"></span>
        </div>
        <p :class="[seenDate ? 'tw-text-gray4' : 'tw-text-gray3']" class="tw-mt-[5px] tw-text-sm" v-text="message"></p>
      </div>
    </ada-btn>
  </div>
</template>
