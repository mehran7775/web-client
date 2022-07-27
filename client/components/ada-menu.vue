<template>
    <span id="menu-context">
        <slot name="activator"></slot>
        <dialog open id="menu" :class="{ 'rtl': rtl }">
            <slot></slot>
        </dialog>
    </span>
</template>

<script lang="ts" setup>
import { computed, onMounted } from '#app'
import { useAsrTrader } from "~/composables";


const appManager = useAsrTrader();

const rtl = computed(() => appManager.rtl);

onMounted(() => {
    const tem = document.getElementById('menu-context')!
    const properties = tem.getBoundingClientRect()
    let dialog = document.getElementById('menu')!
    dialog.style.left = `${properties.left - 6}px`
    dialog.style.top = `${properties.top + 26}px`
    dialog.style.width = `${document.getElementById('auto-complete')?.offsetWidth}px`
    document.body.appendChild(dialog)
})


</script>


<style lang="postcss" scoped>
#menu {
    @apply tw-absolute tw-bg-white tw-outline-none tw-shadow-md tw-z-50 tw-overflow-y-auto tw-rounded-b-md;
    max-height: 165px;
    max-height: 195px;
}
</style>