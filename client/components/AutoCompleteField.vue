<script setup lang="ts">
import { computed } from 'vue';
import { AutoCompleteItem } from '@/types'
import AdaMenu from '@/components/ada-menu.vue'


const props = withDefaults(defineProps<{
    value?: string,
    placeholder?: string,
    background?: string,
    borderColor?: string,
    loading: boolean,
    suggestions: AutoCompleteItem[] | [],
    id?: string

}>(), {
    value: '',
    placeholder: '',
    background: 'tw-bg-white',
    borderColor: 'tw-border-gray-200',
    id: '1'
})


const emit = defineEmits(['input', 'select_item'])

const active_menu = computed(() => {
    if (props.loading || props.suggestions.length || props.value != '') return true
    return false
})

</script>

<style lang="postcss" scoped>
#auto-complete {
    @apply tw-relative tw-z-50 tw-h-[28px] tw-px-2 tw-pt-[2px];

    input {
        @apply tw-w-full tw-border-none tw-p-1;

        &:focus {
            @apply tw-outline-none tw-border-[1.5px];
        }

        &::placeholder {
            @apply tw-text-primary;
        }
    }
}
</style>

<template>
    <div id="auto-complete" :class="[background, active_menu ? 'tw-rounded-t-md' : 'tw-rounded-md']">
        <slot name="lable"></slot>
        <div class="tw-flex tw-items-center">
            <slot name="prepend"></slot>
            <ada-menu :id="id" :active="active_menu">
                <template #activator>
                    <input type="text" id="text-auto-complete" :value="value"
                        @input="$emit('input', $event.target.value)" v-bind="{ ...$attrs }" :placeholder="placeholder"
                        autocomplete="false">
                </template>
                <template #items>
                    <div>
                        <ul class="tw-p-0 tw-m-0 tw-border tw-border-gray-200 tw-text-black tw-bg-white">
                            <template v-if="props.loading">
                                <li class="tw-px-1 tw-py-2" v-text="$t('general.waiting')"></li>
                            </template>
                            <template v-else-if="props.suggestions.length">
                                <li v-for="item in props.suggestions" :key="item.id"
                                    class="hover:tw-bg-primary-100 tw-cursor-pointer tw-px-1 tw-py-2"
                                    @click="$emit('select_item', item)">
                                    <span v-html="item.fullName"></span>
                                </li>
                            </template>
                            <template v-else-if="value != ''">
                                <li class="tw-px-1 tw-py-2" v-text="$t('general.notFound')"></li>
                            </template>
                        </ul>
                    </div>
                </template>
            </ada-menu>
        </div>
        <slot name="append"></slot>
    </div>
</template>