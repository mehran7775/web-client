<script setup lang="ts">
definePageMeta({
  layout:'private-default'
})
// import { usePayment } from "@/composables"
// import { useAxios } from '@/composables'

// const paymentManager = usePayment();

// const banks = computed(() => paymentManager.paymentMethods)

// const axios = useAxios()
const paymentMethod = ref(null);
const router = useRouter();

</script>
<style lang="postcss" scoped>
.tmp-ctr {
  height: 100%;
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
      >div {
        @apply tw-max-w-xs tw-m-auto;

        >.banks {
          @apply tw-flex tw-justify-between tw-mb-[16px] tw-h-[64px];

          >button {
            @apply tw-flex tw-justify-center tw-items-center tw-border tw-border-default tw-rounded-lg;

            &.active {
              @apply tw-border-primary;

              &::after {
                @apply tw-bg-black;
              }
            }
          }
        }

        >.actions {
          @apply tw-h-12 tw-my-[16px] tw-flex tw-justify-between;

          .ada-button {
            @apply tw-w-36;
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

        >span {
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
          <!-- <ada-toggle class="banks" style="flex-grow: 0;">
          <ada-btn color="white" :height="64" :width="64" v-for="(bank, i) in banks" :key="bank.name" :model="i">
            <img :src="'/banks/' + bank.name + '.png'" :alt="bank.name" />
          </ada-btn>
        </ada-toggle> -->
          <div class="actions">
            <ada-btn :height="36" :width="142" to="/accounting/deposit-report">{{
                $t('menu.depositReport')
            }}</ada-btn>
            <ada-btn :height="36" :width="142" dark>{{ $t('accounting.deposit') }}</ada-btn>
          </div>
        </div>
      </form>
      <div class="card">
        <content-viewer src="/accounting/deposit"></content-viewer>
      </div>
    </main>
  </div>
</template>
