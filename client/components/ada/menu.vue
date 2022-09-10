
<script lang="ts" setup>
import { useAsrTrader } from "~/composables";

const props = withDefaults(defineProps<{
    mLeft?: number,
    mTop?: number,
    active?: boolean,
    mWidth?: number,
}>(),
    {
        mLeft: 0,
        mTop: 0,
        active: false,
        mWidth: 0
    }
)

const appManager = useAsrTrader();
const rtl = computed(() => appManager.rtl);
const locale = computed(() => appManager.locale);

const menu = ref(null)

const style = computed(() => {
    const properties = menu.value?.getBoundingClientRect()
    return {
        width: `${ properties?.width + props.mWidth}px`,
        left: `${ properties?.left + props.mLeft }px`,
        top: `${ properties?.top + props.mTop }px`
    }
})

</script>


<style lang="postcss" scoped>
.menu {
    @apply tw-absolute tw-bg-white tw-outline-none tw-shadow-lg tw-overflow-y-auto tw-p-0 tw-m-0 tw-rounded-b;
    max-width: 465px;
    min-width: 145px;
    max-height: 50vh;
    z-index: 9999;
}
</style>

<template>
    <span class="menu-global" ref="menu">
        <slot name="activator"></slot>
        <Teleport to="body">
            <transition name="slide-fade">
                <div v-if="active" class="menu"  :class="[rtl? 'rtl': null, locale]" :style="style">

                    <slot name="prepend-item"></slot>
                    <slot name="items"></slot>
                    <slot name="append-item"></slot>
                </div>
            </transition>
        </Teleport>
    </span>
</template>