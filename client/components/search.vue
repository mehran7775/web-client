
<script lang="ts" setup>

const props = withDefaults(
    defineProps<{
        label?: string,
        placeholder?: string,
        modelValue?: string
    }>(),
    {
        label: '',
        placeholder: '',
        modelValue: ''
    }
)

const emit = defineEmits(['update:modelValue'])
</script>


<style lang="postcss" scoped>
div {
    @apply tw-rounded;

    >input {

        @apply tw-bg-transparent tw-text-primary tw-outline-hidden tw-border-none;

        &::placeholder {
            @apply tw-text-primary
        }

        &:focus {
            @apply tw-outline-none;
        }
    }
}
</style>


<template>
    <div v-bind="$attrs">
        <label for="search" v-text="label"></label>
        <slot name="prepend"></slot>
        <input type="search" id="search" :placeholder="placeholder" :value="props.modelValue"
            @input="(e) => $emit('update:modelValue', (e.target as HTMLInputElement).value)">
        <slot name="append"></slot>
    </div>
</template>
