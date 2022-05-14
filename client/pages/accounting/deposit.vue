<script setup lang="ts">
import ContentViewer from "~~/components/contentViewer.vue";
</script>
<style lang="postcss" scoped>
.deposit {
  @apply tw-grid tw-grid-cols-2 tw-gap-[16px] tw-m-0 tw-p-[16px];
  position: relative;
  height: 100%;
  background-color: rgba(var(--c-primary), 0.1);
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
    min-height: 507px;
  }
}
</style>
<template>
  <main class="deposit">
    <form class="card">frm</form>
    <div class="card">
      <ContentViewer src="/accounting/deposit"></ContentViewer>
    </div>
  </main>
</template>
