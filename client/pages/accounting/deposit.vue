<script setup lang="ts">
import ContentViewer from "~~/components/contentViewer.vue";
import TextInput from "~~/components/textInput.vue";
</script>
<style lang="postcss" scoped>
.tmp-ctr {
  height: 100%;
}

header {
  @apply tw-flex tw-col-span-2 tw-items-center tw-px-8;
  color: var(--c-primary-rgb);
  background-color: rgba(var(--c-primary), 0.1);
  height: 42px;
  width: 100%;
  font-weight: bold;
}

.deposit {
  @apply tw-grid tw-grid-cols-2 tw-gap-[16px] tw-m-0 tw-p-[16px];
  position: relative;
  height: calc(100% - 42px);
  background-color: rgba(var(--c-primary), 0.01);

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: white;
    z-index: -1;
  }

  .card {
    @apply tw-p-[24px];
    border-radius: var(--border-radius-panel);
    background-color: white;
    height: 100%;

    &form {}
  }
}
</style>
<template>
  <div class="tmp-ctr">
    <header>{{ $t("menu.deposit") }}</header>
    <main class="deposit">
      <form class="card tw-flex tw-basis-1/2 tw-justify-center">
        <text-input style="flex-grow: 0;" label="مبلغ">
          <template #append>
            <span class="tw-mx-1">
              ریال
            </span>
          </template>
        </text-input>
      </form>
      <div class="card">
        <content-viewer src="/accounting/deposit"></content-viewer>
      </div>
    </main>
  </div>
</template>
