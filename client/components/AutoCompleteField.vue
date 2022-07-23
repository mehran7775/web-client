<script setup lang="ts">
const props = withDefaults(defineProps<{
    value?: string,
    placeholder?: string,
    background?: string,
    borderColor?: string,
    suggestions?: boolean

}>(), {
    value: '',
    placeholder: '',
    background: 'tw-bg-white',
    borderColor: 'tw-border-gray-200',
    suggestions: false
})

</script>

<style lang="postcss" scoped>
#auto-complete {
    @apply tw-relative tw-z-50 tw-min-h-[28px] tw-rounded tw-px-2 tw-pt-[2px];

    input {
        @apply tw-w-full tw-border-none tw-p-1;

        &:focus {
            @apply tw-outline-none tw-border-[1.5px];
        }

        &::placeholder {
            @apply tw-text-primary;
        }
    }

    .suggestions {
        @apply tw-absolute tw-left-0 tw-right-0 tw-rounded-b-md tw-max-w-full tw-w-full tw-max-h-72 tw-shadow-md tw-overflow-auto;
    }
}
</style>

<template>
    <div id="auto-complete" :class="[background, suggestions ? 'tw-rounded-t-md' : 'tw-rounded-md']">
        <slot name="lable"></slot>
        <div class="tw-flex tw-items-center">
            <slot name="prepend"></slot>
            <input type="text" id="text-auto-complete" :value="value" @input="$emit('input', $event.target.value)"
                v-bind="{ ...$attrs }" :placeholder="placeholder" autocomplete="false">
        </div>
        <slot name="append"></slot>
        <div class="suggestions">
            <slot name="suggestions"></slot>
        </div>
    </div>
</template>