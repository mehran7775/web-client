
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
const menuContent = ref(null)
//TODO reactive style
const style = computed(() => {
    const properties = menu.value.getBoundingClientRect()
    menuContent.value?.getBoundingClientRect();
    return {
        width: `${ properties?.width + props.mWidth}px`,
        left: `${ properties?.left + props.mLeft }px`,
        top: `${ properties?.top + props.mTop }px`
    }
})

</script>


<style lang="postcss" scoped>
/* .menu-global {
    @apply tw-block tw-w-full;
} */
.menu {
    @apply tw-absolute tw-bg-white tw-outline-none tw-shadow-lg tw-overflow-y-auto tw-p-0 tw-m-0 tw-rounded-b;
    max-width: 465px;
    max-height: calc(50vh - 76px);
    z-index: 999;

    ul li {
        @apply hover:tw-bg-primary/10;
    }
}
</style>

<template>
    <div class="menu-global" ref="menu">
        <slot name="activator"></slot>
        <Teleport to="body">
            <transition name="slide-fade">
                <div ref="menuContent" :style="style" v-if="active" class="menu"  :class="[rtl? 'rtl': null, locale]">

                    <slot name="prepend-item"></slot>
                    <slot name="items"></slot>
                    <slot name="append-item"></slot>
                </div>
            </transition>
        </Teleport>
    </div>
</template>