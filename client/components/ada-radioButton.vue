<script lang="ts" setup>
import { ref, computed } from '#app'
import { useAsrTrader } from "~/composables";

export interface radioButton {
    label: string,
    value: string | number
}

const props = withDefaults( defineProps<{
    items: radioButton[],
    size?: string | number,
    bg?: string
}>(),{
    items: [{ label: '', value: 0 }],
    size: 24,
    bg: 'tw-bg-gray5'
})

const model = ref<string | number>(props.items[0].value)
const appManager = useAsrTrader();

const rtl = computed(() => appManager.rtl);

</script>

<style lang="postcss" scoped>
.radio {
    @apply tw-relative;

    label {
        align-items: center;
        justify-content: center;
        padding: 10px 35px;
        min-width: 50px;
        margin: auto 10px;
        border-radius: var(--border-radius-root);
    }
}
</style>

<template>
    <div class="radio">
        <label v-for="(item, i) in items" :key="item.value" :for="`radio-button-${i}`"
            class="tw-relative tw-cursor-pointer" :class="[model === item.value ? bg: null, rtl ? 'tw-flex': 'tw-flex-row-reverse']">
            <div>
                <ada-icon class="tw-cursor-pointer"
                    :color="model === item.value ? 'primary' : 'gray4'" :size="size">isax-tick-circle-bold</ada-icon>
                <input class="tw-absolute tw-left-0 tw-top-0 tw-opacity-0 tw-rounded-full tw-cursor-pointer"
                    type="radio" name="one" :value="item.value" v-model="model" :id="`radio-button-${i}`" />
            </div>
            <span v-text="item.label" :class="[model === item.value ? 'tw-text-primary' : 'tw-text-gray1', 'tw-mx-2']"></span>
        </label>
    </div>
</template>