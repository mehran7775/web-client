<template>
    <div class="message" v-bind="$attrs">
        <ada-btn color="transparent" class="tw-font-normal tw-w-full tw-px-3 tw-rounded-none tw-h-full tw-pt-2">
            <div class="template">
                <div class="header">
                    <h4>فرآور</h4>
                    <span>۱۴۰۱/۰۴/۰۱</span>
                </div>
                <div class="body">
                    <ada-icon :size="21">isax-menu</ada-icon>
                    <p class="tw-text-ellipsis tw-whitespace-nowrap tw-overflow-hidden tw-mt-1 tw-mr-1">آگهی دعوت به مجمع عمومی ‌فوق‌العاده</p>
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
        @apply tw-w-full tw-flex tw-flex-col tw-mx-auto;
        
        .header {
            @apply tw-flex tw-items-center tw-justify-between;

            h4 {
                @apply tw-text-primary;
            }
        }

        .body {
            @apply tw-flex tw-items-start tw-justify-between tw-pt-3;
        }
    }

}
</style>