<!-- <template>
    <div v-show="show" class="context-menu" ref="context" tabindex="0" :style="style">
        {{ items }}
        <span>
            <slot></slot>
        </span>
    </div>
</template> -->
<template>
    <span>
        <slot name="activator"></slot>
        <dialog ref="menu">
        </dialog>
    </span>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from '#app'

//////////

const props = defineProps<{
    display: boolean
}>()


//////////

const show = ref<boolean>(true)
const left = ref<number>(200)
const top = ref<number>(50)



/////////

const style = computed(() => {
    return {
        left: `${left.value}px`,
        top: `${top.value}px`
    }
})



///////////

const close = (): void => {
    show.value = false
    left.value = 0
    top.value = 0
}
const open = (e: Element): void => {
    const loc = e.getBoundingClientRect()
    left.value = loc.left
    top.value = loc.top
    show.value = true
}

defineExpose({ close, open })

</script>


<style lang="postcss" scoped>
.context-menu {
    @apply tw-fixed tw-bg-white tw-outline-none tw-shadow-md tw-w-40 tw-z-50 tw-overflow-y-auto;
    max-height: 165px;
    max-height: 185px;
}
</style>