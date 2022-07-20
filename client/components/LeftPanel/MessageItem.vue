<template>
    <div class="message" v-bind="$attrs" @click="show_message()">
        <ada-btn color="transparent" class="template">
            <ada-icon :size="26" v-if="type == types.rlc" class="tw-text-primary">lotfi-sms</ada-icon>
            <ada-icon :size="26" v-else-if="props.type == types.codal" class="tw-text-green">isax-document-text-outline
            </ada-icon>
            <ada-icon :size="26" v-else-if="props.type == types.tedan" class="tw-text-red">isax-messages-3-outline
            </ada-icon>
            <ada-icon :size="26" v-else class="tw-text-blue">isax-note-favorite-outline</ada-icon>
            <div class="tw-mr-2 tw-pt-3 tw-w-5/6">
                <div class="tw-flex tw-items-center tw-justify-between">
                    <h4 class="tw-text-primary tw-text-lg" v-text="title"></h4>
                    <span v-text="date()"></span>
                </div>
                <p class="tw-mt-[5px] tw-text-sm" v-text="message"></p>
            </div>
        </ada-btn>
    </div>
</template>

<script lang="ts" setup>
import { useAsrTrader } from "~/composables";
import { Message } from '~/types/message';

enum types {
    rlc = 1,
    tedan = 4,
    codal = 5,
}
///// 
const props = withDefaults(defineProps<{
    id?: number,
    dateTime?: string | null,
    title?: string,
    preview?: string,
    origin?: number,
    type?: number,
    flags?: number,
    message?: string,
    seenDate?: string | null
}>(), {
    dateTime: null,
    seenDate: null
})


const emits = defineEmits(['click'])




/////

const appManager = useAsrTrader();
const locale = appManager.locale;
const date = () => {
    return new Date(props.dateTime!.split('T')[0]).toLocaleDateString(locale)
}


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
        seenDate: props.seenDate
    }
    emits('click', item)
}

</script>


<style lang="postcss" scoped>
.message {
    @apply tw-pt-1;

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