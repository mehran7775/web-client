<script setup lang="ts">
import ContentViewer from "~~/components/contentViewer.vue";
import TextInput from "~~/components/textInput.vue";
import AdaBtn from "~~/components/adaBtn.vue";
import AdaToggle from "~~/components/adaToggle.vue";
import { computed, ref, useRouter } from "#app"
import { usePayment } from "@/composables"

const paymentManager = usePayment();

const banks = computed(() => paymentManager.paymentMethods)
const paymentMethod = ref(null);
const router = useRouter();
function gotoReportDeposit() {
  router.push('/accounting/deposit-report')
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

  form {
    &.card {
      >* {
        @apply tw-flex tw-h-[32px] tw-w-[308px] tw-items-center;
        font-size: 1rem;
      }

      >.label {
        @apply tw-mb-4 tw-mt-[16px] tw-h-[16px];
        font-weight: bold;
        color: var(--c-primary-rgb);
      }

      >.input {
        @apply tw-mb-[16px] tw-h-[42px];
        background-color: rgba(var(--c-primary), 0.05);
        border-radius: 8px;
        border: solid 1px var(--c-primary-rgb);


        >span {
          @apply tw-flex tw-items-center tw-justify-center;
          font-weight: bold;
          min-width: 42px;
          height: 100%;
          background-color: rgba(var(--c-primary), 0.1);
          border-radius: 8px 0 0 8px;
        }
      }

      >.banks {
        @apply tw-flex tw-justify-between tw-mb-[16px] tw-h-[64px];

        >button {
          @apply tw-flex tw-justify-center tw-items-center;
          border-radius: 8px;
          border: 1px solid var(--c-default-rgb);

          &.active {
            border: solid 1.5px var(--c-primary-rgb);

            &::after {
              background-color: rgba(0, 0, 0, 0);
            }
          }
        }
      }

      >.actions {
        @apply tw-h-12 tw-my-[16px] tw-justify-between;
      }
    }
  }
}
</style>
<template>
  <div class="tmp-ctr">
    <header>{{ $t("menu.deposit") }}</header>
    <main class="deposit">
      <form class="card tw-flex tw-flex-col tw-items-center">
        <span class="label">مبلغ:</span>
        <text-input type="number" class="input" style="flex-grow: 0;" rounded="0 8px 8px 0" bg="rgba(0,0,0,0)"
          :active-border="false">
          <template #append>
            <span>
              ریال
            </span>
          </template>
        </text-input>
        <span class="label">درگاه:</span>
        <ada-toggle class="banks" style="flex-grow: 0;">
          <ada-btn color="white" :height="64" :width="64" v-for="(bank, i) in banks" :key="bank.name" :model="i">
            <img :src="'/banks/' + bank.name + '.png'" :alt="bank.name" />
          </ada-btn>
        </ada-toggle>
        <div class="actions">
          <ada-btn :height="36" :width="142" color="primary" @click="gotoReportDeposit" bordred>{{
              $t('menu.depositReport')
          }}</ada-btn>
          <ada-btn :height="36" :width="142" color="primary" dark>{{ $t('accounting.deposit') }}</ada-btn>
        </div>
      </form>
      <div class="card">
        <content-viewer src="/accounting/deposit"></content-viewer>
      </div>
    </main>
  </div>
</template>
