<script lang="ts" setup>
const active = ref(false);
</script>

<style lang="postcss" scoped>

  .calculate {
    @apply tw-rounded tw-shadow tw-flex tw-flex-col tw-py-[14px] tw-px-[8px] tw-bg-white tw-w-[300px] tw-mx-auto tw-text-black;
    /* @apply  */
    .ada-input {
      @apply tw-flex;
      & :deep(.label) {
        @apply tw-w-[60px];
      }
      & :deep(.scaffold) {
        @apply tw-w-full;
        border-color: transparent;
      }
      &>:last-child {
        @apply tw-mt-[8px];
      }
      &.active {
        & :deep(.scaffold) {

          @apply tw-border-primary;
        }
      }
    }

    &>:first-child{
      @apply tw-mb-[16px];
    }

    &>:last-child {
      @apply tw-mt-[16px];
      span:last-child {
        @apply tw-mr-6 tw-text-info;
      }
    }

  }
</style>

<template>
  <div class="tw-relative tw-z-30 tw-h-screen tw-bg-primary">
    <div class="calculate"
    >
      <div class="tw-flex">
        <h6>مانده قابل براشت:</h6>
        <span class="tw-mr-2 tw-text-success">
          <b>10000000</b>
           تومان
          </span>
      </div>
      <ada-input
        label="کل مبلغ"
        type="number"
        placeholder="0"
      >
      </ada-input>
      <ada-input
        label="قیمت"
        type="number"
        placeholder="3345"
      >
      </ada-input>

      <div>
        <span>کارمزد:</span>
        <span>
          <b>25000</b>
          تومان</span>
      </div>
    </div>
  </div>
</template>
