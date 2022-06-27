
<script lang="ts" setup>
import { ref } from '#app';

const props = withDefaults(
    defineProps<{
        label: string,
        placeholder: string,
        value: string
    }>(),
    {
        label: '',
        placeholder: '',
        value: ''
    }
)

const emits = defineEmits(['update'])
</script>

<template>
    <div v-bind="$attrs">
        <label for="search" v-text="label"></label>
        <slot name="prepend"></slot>
        <input type="search" id="search" :placeholder="placeholder" :value="props.value" @input="(e)=> $emit('update', e.target.value)"
        >
        <slot name="append"></slot>
    </div>
</template>

<style lang="postcss" scoped>
div {
    @apply tw-rounded-md;

    >input {
        
        @apply tw-bg-transparent tw-text-blue tw-outline-hidden tw-border-none;
        &::placeholder {
            color: var(--c-primary-rgb);
        }

        &:focus{
            @apply tw-outline-none;
        }
    }
}

</style>