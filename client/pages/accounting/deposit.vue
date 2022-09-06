<script setup lang="ts">
import { usePayment } from "@/composables";
import { useAxios } from "@/composables";

definePageMeta({
  layout: "private-default",
});

const appManager = useAsrTrader();
const lang: string = appManager.locale.split("-")[0];

const paymentManager = usePayment();

const banks = computed(() => paymentManager.paymentMethods);

const axios = useAxios();
const paymentMethod = ref(null);
const router = useRouter();
</script>
<style lang="postcss" scoped>
.tmp-ctr {
  @apply tw-h-full tw-w-full;
}

header {
  @apply tw-flex tw-col-span-2 tw-items-center tw-px-8 tw-w-full tw-h-[42px] tw-font-bold tw-text-black tw-bg-primary tw-bg-opacity-20;
}

.deposit {
  @apply tw-grid tw-grid-cols-2 tw-gap-[16px] tw-m-0 tw-p-[16px] tw-relative tw-bg-primary tw-bg-opacity-10;
  height: calc(100% - 42px);

  &::before {
    content: "";
    @apply tw-absolute tw-w-full tw-h-full tw-top-0 tw-left-0 tw-bg-white;
    z-index: -1;
  }

  .card {
    @apply tw-p-[24px] tw-bg-white;
    border-radius: var(--border-radius-panel);

    .label {
      @apply tw-text-primary tw-font-bold;
    }
  }

  form {
    &.card {
      > div {
        @apply tw-m-auto;
        max-width: 310px;
        > .banks {
          @apply tw-flex tw-justify-between tw-w-full tw-mb-[16px] tw-h-[64px];

          > button {
            @apply tw-flex tw-justify-center tw-items-center tw-border tw-border-default tw-rounded-lg  tw-w-[64px] tw-text-white tw-bg-white;
            &.active {
              @apply tw-border-primary;

             
            }
          }
        }

        > .actions {
          @apply tw-h-12 tw-my-[16px] tw-flex tw-justify-between;

          .ada-button {
            width: 45%;
            &:nth-child(1) {
              @apply tw-bg-white tw-border tw-border-primary tw-bg-opacity-90 hover:tw-bg-primary hover:tw-bg-opacity-90 hover:tw-text-white;
            }
            &:nth-child(2) {
              @apply tw-bg-primary tw-bg-opacity-90 tw-text-white;
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="postcss">
.deposit {
  .card {
    .ada-input {
      @apply tw-mt-4;

      .label {
        @apply tw-mt-2 tw-text-primary tw-font-bold;
      }

      .scaffold {
        @apply tw-border tw-border-gray4 tw-px-3 tw-h-[42px];

        > span {
          @apply tw-bg-primary tw-bg-opacity-10 tw-block tw-relative tw-h-full tw-w-11 tw-text-center tw-pt-[3px] tw-font-bold -tw-left-[12px];
        }

        &.active {
          @apply tw-border-primary;
        }
      }
    }
  }
}
</style>
<template>
  <div class="tmp-ctr">
    <header>{{ $t("menu.deposit") }}</header>
    <main class="deposit">
      <form class="card">
        <div>
          <ada-input type="number" :label="$t('accounting.amount')">
            <template #append>
              <span v-text="$t('accounting.currency.rial')"></span>
            </template>
          </ada-input>
          <span class="label" v-text="$t('accounting.gateway')"></span>
          <ada-toggle class="banks" style="flex-grow: 0">
            <ada-btn
              v-for="(bank, i) in banks"
              :key="bank.name"
              :model="i"
            >
              <img :src="'/images/banks/' + bank.name + '.png'" :alt="bank.name" />
            </ada-btn>
          </ada-toggle>
          <div class="actions">
            <ada-btn
              to="/accounting/deposit-report"
              >{{ $t("menu.depositReport") }}</ada-btn
            >
            <ada-btn :height="36" :width="142" dark>{{
              $t("accounting.deposit")
            }}</ada-btn>
          </div>
        </div>
      </form>
      <div class="card">
        <ContentDoc :path="`${lang}/accounting/deposit`" class="doc" />
      </div>
    </main>
  </div>
</template>
