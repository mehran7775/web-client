<script lang="ts" setup>
import { Ref } from 'vue'

export interface RadioButton {
    label: string,
    value: string | number
}

const props = withDefaults(defineProps<{
    items?: Array<RadioButton>,
    size?: string | number,
}>(), {
    items: () => [{ label: '', value: 0 }],
    size: 24,
})

const value: Ref<any> = inject("toggle-ref", ref(1));

</script>

<style lang="postcss" scoped>
.radio {
    @apply tw-relative tw-m-auto tw-max-w-full;

    label {
        @apply tw-flex tw-items-center tw-justify-center tw-py-1 tw-px-[1rem] tw-my-auto tw-mx-[10px] tw-rounded;
        min-width: 50px;
        transition: all .2s;

        span {
            @apply tw-text-black;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        .icon{
            @apply tw-text-gray3;
        }
        &.active {
            @apply tw-scale-110 tw-bg-gray6;

            span, .icon {
                @apply tw-text-primary;
            }
        }
       
    }
}
</style>

<template>
    <div class="radio">
        <label v-for="(item, i) in items" :key="item.value" :for="`radio-button-${i}`"
            class="tw-relative tw-cursor-pointer" :class="{ active: value === item.value }">
            <div>
                <ada-icon class="tw-cursor-pointer" :size="size">
                    isax-tick-circle-bold</ada-icon>
                <input class="tw-absolute tw-left-0 tw-top-0 tw-opacity-0 tw-rounded-full tw-cursor-pointer"
                    type="radio" name="one" :value="item.value" v-model="value" :id="`radio-button-${i}`" />
            </div>
            <span v-text="$t(item.label)" class="tw-mx-2"></span>
        </label>
    </div>
</template>