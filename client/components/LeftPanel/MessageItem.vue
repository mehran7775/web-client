<template>
    <div class="message" v-bind="$attrs">
        <ada-btn color="transparent" class="template">
            <!-- <div class="template"> -->
            <ada-icon :size="26" v-if="type == 1" class="tw-text-primary">lotfi-sms</ada-icon>
            <ada-icon :size="24" v-else-if="props.type == 2" class="tw-text-green">isax-document-text-outline</ada-icon>
            <ada-icon :size="24" v-if="props.type == 3" class="tw-text-red">isax-messages-3-outline</ada-icon>
            <ada-icon :size="24" v-if="props.type == 4" class="tw-text-blue">isax-note-favorite-outline</ada-icon>
            <div class="tw-mr-2 tw-pt-3 tw-w-4/5">
                <div class="tw-flex tw-items-center tw-justify-between">
                    <h4 class="tw-text-primary tw-text-lg">فرآور</h4>
                    <span>۱۴۰۱/۰۴/۰۱</span>
                </div>
                <p class="tw-mt-[5px] tw-text-sm">آگهی دعوت به مجمع عمومی ‌فوق‌العاده</p>
            </div>
            <!-- </div> -->
        </ada-btn>
    </div>
</template>

<script lang="ts" setup>

import { useBottomPanel } from "~/composables";


const props = defineProps<{
    id: number,
    dateTime: string | null,
    title: string,
    preview: string,
    origin: number,
    type: number,
    flags: number,
    message: string,
    seenDate: string,
}>()

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