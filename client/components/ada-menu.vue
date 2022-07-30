<template>
    <span id="menu-context">
        <slot name="activator"></slot>
        <dialog open id="menu" :class="{ 'rtl': rtl }">
            <slot name="prepend-item"></slot>
            <slot name="items"></slot>
            <slot name="append-item"></slot>
        </dialog>
    </span>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from '#app'
import { useAsrTrader } from "~/composables";

const props = withDefaults(defineProps<{
    mLeft: number,
    mTop: number
}>(),
{
    mLeft: 0,
    mTop: 0
}
)


const appManager = useAsrTrader();

const rtl = computed(() => appManager.rtl);

onMounted(() => {
    const tem = document.getElementById('menu-context')!
    const properties = tem.getBoundingClientRect()
    let dialog = document.getElementById('menu')!
    dialog.style.left = `${properties.left - props.mLeft}px`
    dialog.style.top = `${properties.top + props.mTop}px`
    document.body.appendChild(dialog)
})
onUnmounted(() => {
    let dialog = document.getElementById('menu')!
    dialog.remove()
})


</script>


<style lang="postcss" scoped>
#menu {
    @apply tw-absolute tw-bg-white tw-outline-none tw-shadow-md tw-z-50 tw-overflow-y-auto tw-rounded-b-md tw-w-[164px];
    max-width: 165px;
    max-height: 195px;
}
</style>