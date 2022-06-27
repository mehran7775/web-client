<template>
    <div class="message" v-bind="$attrs">
        <ada-btn color="transparent" class="tw-font-normal tw-w-full tw-px-3 tw-rounded-none tw-h-full tw-pt-1 tw-mt-[1px]">
            <div class="template">
                <div class="header">
                    <h4 class="tw-text-primary tw-text-lg">فرآور</h4>
                    <span>۱۴۰۱/۰۴/۰۱</span>
                </div>
                <div class="body">
                    <ada-icon :size="24" v-if="type == 1" class="tw-text-primary">lotfi-sms</ada-icon>
                    <ada-icon :size="22" v-else-if="props.type == 2" class="tw-text-green">isax-document-text-outline</ada-icon>
                    <ada-icon :size="22" v-if="props.type == 3" class="tw-text-red">isax-messages-3-outline</ada-icon>
                    <ada-icon :size="22" v-if="props.type == 4" class="tw-text-blue">isax-note-favorite-outline</ada-icon>
                    <p class="tw-mt-[5px] tw-mr-1 tw-text-sm">آگهی دعوت به مجمع عمومی ‌فوق‌العاده</p>
                </div>
            </div>
        </ada-btn>
    </div>
</template>

<script lang="ts" setup>
import { Ref } from '#app'

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
        @apply tw-w-full tw-flex tw-flex-col tw-mx-auto tw-px-1;
        
        .header {
            @apply tw-flex tw-items-center tw-justify-between;
        }

        .body {
            @apply tw-flex tw-items-start tw-justify-between tw-pt-3;
        }

        h4, .body>p{
            @apply tw-text-ellipsis tw-whitespace-nowrap tw-overflow-hidden;
        }
    }

}
</style>