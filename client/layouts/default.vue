<script setup lang="ts">
const appManager = useAsrTrader();
const locale = computed(() => appManager.locale);
const rtl = computed(() => appManager.rtl);
const snacks = useSnacks().snacks
</script>

<style lang="postcss" scoped>
.page {
    @apply tw-relative tw-overflow-clip tw-bg-primary;
    height: 100vh;

    .pie-1 {
        top: -290px;
        right: -100px;
    }

    .pie-2 {
        bottom: -290px;
        left: -210px;
    }

    main {
        @apply tw-w-full tw-overflow-y-auto;
        height: 100vh;
    }

    footer {
        @apply tw-fixed tw-px-2 tw-w-full tw-text-gray4;
        height: 32px;
        bottom: 0;
        left: 0;
    }
}
</style>

<template>
    <div class="page">
        <div class="pie-1 pie"></div>
        <div class="pie-2 pie"></div>
        <main :class="[locale, rtl ? 'rtl fa' : 'ltr en']">
         <NuxtPage />
        </main>
        <footer :class="[locale, rtl ? 'rtl' : 'ltr']" class="tw-justify-start tw-text-start tw-h-[32px]">
            <span>
                {{ $t("general.copyRight") }}
            </span>
        </footer>
        <!-- //TODO -->
        <!-- <TransitionGroup tag="dialog" name="snack" class="snacks">
        </TransitionGroup> -->
        <ada-snacks/>
    </div>
</template>