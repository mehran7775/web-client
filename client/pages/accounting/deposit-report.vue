<script setup lang="ts">
import ContentViewer from "~~/components/contentViewer.vue";
import TextInput from "~~/components/textInput.vue";
import SelectBox from "~~/components/selectBox/index.vue";
import AdaBtn from "~~/components/adaBtn.vue";
import DateInput from "~~/components/DateTime/dateInput.vue";
import { useRouter } from "#app"
const router = useRouter()
function goToDeposit() {
  router.push('/accounting/deposit');
}
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
  }

  form.card {
    @apply tw-flex tw-flex-col;

    >div {
      @apply tw-flex tw-gap-x-8 tw-gap-y-2;

      &:nth-child(n) {
        @apply tw-grid;
      }

      &:nth-child(1) {
        @apply tw-grid-cols-3;

        >span {
          @apply tw-flex tw-items-center tw-justify-start tw-h-[23px];
        }

        >label {
          @apply tw-h-12;
        }
      }

      &:nth-child(2) {
        @apply tw-grid-cols-2 tw-my-[16px];

        >label {
          @apply tw-h-12;
        }
      }

      &:nth-child(3) {
        @apply tw-h-[83px];
        border-radius: 8px;
        border: dashed 1px var(--c-info-rgb);
        color: var(--c-info-rgb);
        background-color: rgba(var(--c-primary), 0.1);
        height: 83px;
      }

      &:nth-child(4) {
        @apply tw-grid-cols-2 tw-mt-[20px];

        button {
          @apply tw-flex-grow;
        }
      }
    }

  }
}
</style>
<template>
  <div class="tmp-ctr">
    <header>{{ $t("menu.depositReport") }}</header>
    <main class="deposit">
      <form class="card">
        <div>
          <span>مبلغ واریز (ریال)</span>
          <span>تاریخ واریز</span>
          <span>شماره</span>
          <text-input type="number"></text-input>
          <date-input></date-input>
          <text-input type="number"></text-input>
        </div>
        <div>
          <select-box placeholder="شماره حساب کارگزار"></select-box>
          <select-box placeholder="علت واریز وجه"></select-box>
        </div>
        <div v-ada-dropzone>file</div>
        <div>
          <ada-btn :height="36" color="primary" @click="goToDeposit" bordred>{{
              $t('menu.deposit')
          }}</ada-btn>
          <ada-btn :height="36" color="primary" dark>{{ $t('accounting.deposit-report') }}</ada-btn>
        </div>
      </form>
      <div class="card">
        <ContentViewer src="/accounting/deposit-report"></ContentViewer>
      </div>
    </main>
  </div>
</template>
