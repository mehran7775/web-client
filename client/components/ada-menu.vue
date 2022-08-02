<template>
    <span :class="`menu-global menu-context-${id}`">
        <slot name="activator"></slot>
        <dialog open :id="`menu-${id}`" :class="{ 'rtl': rtl, }" class="menu">
            <transition name="slide-fade">
                <div v-if="active">

                    <slot name="prepend-item"></slot>
                    <slot name="items"></slot>
                    <slot name="append-item"></slot>
                </div>
            </transition>
        </dialog>
    </span>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, inject, watch, ref } from '#app'
import { useAsrTrader } from "~/composables";

const props = withDefaults(defineProps<{
    id?: string,
    mLeft: number,
    mTop: number,
    active?: boolean
}>(),
    {
        id: '1',
        mLeft: 6,
        mTop: 25,
        active: false
    }
)

const appManager = useAsrTrader();

const rtl = computed(() => appManager.rtl);


// const style = computed(() => {
//     const tem = document.querySelector(`.menu-context-${ props.id }`)!

//     const properties = tem.getBoundingClientRect()
//     return {
//         left: `${properties.left - props.mLeft}px`,
//         top: `${properties.top + props.mTop}px`
//     }

// })



onMounted(() => {
    const tem = document.querySelector(`.menu-context-${props.id}`)!
    const properties = tem.getBoundingClientRect()
    let dialog = document.getElementById(`menu-${props.id}`)!
    dialog.style.left = `${properties.left - props.mLeft}px`
    dialog.style.top = `${properties.top + props.mTop}px`
    document.body.appendChild(dialog)
})
onUnmounted(() => {
    let dialog = document.getElementById(`menu-${props.id}`)!
    dialog.remove()
})


</script>


<style lang="postcss" scoped>
.menu {
    @apply tw-absolute tw-bg-white tw-outline-none tw-shadow-lg tw-overflow-y-auto tw-rounded-b-md tw-w-[164px];
    max-width: 165px;
    max-height: 50vh;
    z-index: 10001;
}
</style>