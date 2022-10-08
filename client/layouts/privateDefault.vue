<script setup lang="ts">
import { useUser, useWealth } from "@/composables";

const appManager = useAsrTrader();
const userManager = useUser();
const bottomPanelManager = useBottomPanel();
const wealthManager = useWealth();
const wbsocket = useWebSocket();

const locale = computed(() => appManager.locale);
const rtl = computed(() => appManager.rtl);
const rightMenu = ref({
  mini: true,
  drawer: true,
});
const leftMenu = ref({
  drawer: true,
});
const rmini = computed({
  get: () => rightMenu.value.mini,
  set(val) {
    rightMenu.value.mini = val;
    if (!lmini.value) lmini.value = true;
  },
});
const lmini = computed({
  get: () => bottomPanelManager.LeftPanelMini,
  set(val) {
    bottomPanelManager.LeftPanelMini = val;
    if (!rightMenu.value.mini) rightMenu.value.mini = true;
  },
});

lmini.value = true;
const formatter = appManager.formatter;
const collaps = computed(() => {
  const tab = bottomPanelManager.activeTab;
  return tab && tab != null;
});
const home = computed(() => userManager.me.settings?.home);
const clipped = ref(true);
const invisibleFinInfo = ref(false);


const triggerChatRoom = ()=> {
  rmini.value = !rmini.value
  appManager.setMenu('menu.chat')
}
</script>

<style lang="postcss" scoped>
.page {
  @apply tw-relative tw-block tw-overflow-x-hidden tw-overflow-y-auto tw-h-screen tw-pt-[42px] tw-pb-[64px] tw-bg-gray4/5;

  > header {
    @apply tw-flex tw-fixed tw-w-full tw-justify-between tw-items-center tw-align-middle;
    top: 0;
    left: 0;
    height: 42px;
    background-color: #f9fafe;
    box-shadow: 0 1px 4px rgba(0,0,0,.05)!important;

    * {
      @apply tw-leading-[42px];
    }

    > a span {
      @apply tw-text-primary;
    }

    .icon {
      &.open {
        @apply tw-rotate-180;
      }
    }

    div.start {
      @apply tw-flex tw-pr-[10px];
    }

    div.center {
      @apply tw-w-1/3;

      .ada-badge:first-child :deep(.badge) {
        @apply tw-bg-success;
      }

      .ada-badge:nth-child(2) :deep(.badge) {
        @apply tw-bg-warning;
      }
    }

    div.end {
      .userMenu .menu-global :deep(.ada-button) {
        @apply tw-bg-transparent;
      }
    }
  }

  > main {
    @apply tw-w-full tw-overflow-y-auto;
    height: calc(100vh - 106px);
    box-sizing: border-box;
  }

  > .footer {
    @apply tw-flex tw-items-center tw-w-full tw-justify-center tw-transition-all;
    height: 32px;
    position: fixed;
    bottom: 0;

    .summary {
      @apply tw-justify-self-center tw-flex tw-items-center tw-justify-center;

      .badge-content {
        min-width: 60px;
        @apply tw-mr-1;
      }

      .ada-badge {
        &:first-child :deep(.badge) {
          @apply tw-bg-success;
        }

        &:nth-child(2) :deep(.badge) {
          @apply tw-bg-error;
        }

        &:nth-child(3) :deep(.badge) {
          @apply tw-bg-warning;
        }

        &:nth-child(4) :deep(.badge) {
          @apply tw-bg-primary;
        }

        &:nth-child(5) :deep(.badge) {
          @apply tw-bg-info;
        }
      }
    }

    .cw {
      @apply tw-justify-self-end tw-flex tw-text-gray3 tw-px-3;
    }
  }

  .dashboardmain-page {
    @apply tw-transition-all tw-ease-in-out tw-duration-700 tw-bg-primary/5;
    padding-left: 48px !important;
    padding-right: 48px !important;
  }

  .mainBackground {
    background-color: rgba(var(--c-default), 0.05);

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: white;
      content: "";
    }
  }

  @media (min-width: 960px) {
    .dashboardmain-page {
      &.left {
        padding-left: 256px !important;
      }

      &.right {
        padding-right: 256px !important;
      }
    }
  }

  @media (max-width: 959px) {
  }

  .dashboardmain-nuxt {
    overflow-y: auto;
    height: calc(100vh - 106px);
    position: relative;

    &.collaps {
      height: 362px;
    }
  }

  .floating-button {
    @apply tw-fixed tw-z-[9999] tw-rounded-full tw-bg-primary tw-w-11 tw-h-11 tw-bottom-3;

    .icon {
      @apply tw-text-white;
    }
  }

  #colopse-info-footer {
    @apply tw-left-2;
  }
  #chat-footer {
    @apply tw-right-2;
  }
}
</style>

<style lang="postcss">
.page {
  header > .end {
    .userMenu .ada-button {
      @apply tw-flex tw-items-center tw-bg-transparent tw-transition-all;

      > div {
        @apply tw-flex tw-justify-center tw-items-center;
      }

      &:hover {
        @apply tw-bg-primary/5;
      }
    }
  }
}
</style>

<template>
  <div class="page" :class="[locale, rtl ? 'rtl' : 'ltr']">
    <header>
      <div class="start">
        <nuxt-link
          class="tw-flex tw-px-2 tw-items-center tw-justify-center"
          :to="home"
        >
          <img class="tw-m-0 tw-p-0 tw-h-[20px]" src="/logo.png" />
          <span v-if="!rightMenu.mini && rightMenu.drawer" class="tw-mr-2">
            {{ $t("general.proxyCompany") }}
          </span>
        </nuxt-link>
        <ada-icon
          click="click"
          @click.stop="
            () => {
              if (rightMenu.drawer) {
                rightMenu.mini = !rightMenu.mini;
                if (!rightMenu.mini) lmini = true;
              } else {
                rightMenu.drawer = true;
                rightMenu.mini = false;
              }
            }
          "
          :class="[
            'tw-m-0',
            'tw-p-0',
            'te-mx-[5px]',
            'drawer-activator',
            !rightMenu.mini && rightMenu.drawer ? 'open' : '',
          ]"
          :size="18"
        >
          mdi-menu-open
        </ada-icon>
        <clock :format="$t('general.date.longdt')" class="tw-w-[240px]" />
      </div>
      <div class="tw-flex center">
        <ada-badge class="tw-mx-5">
          <span v-text="$t('oms.bourseIndex')" class="tw-text-primary"></span>:
          <span class="tw-text-sm badge-content"
            >{{ formatter.format(1502605.15) }}
            <span
              v-text="
                `(${new Number(8471.09).toLocaleString(appManager.locale)})`
              "
              class="tw-text-error"
            ></span>
          </span>
        </ada-badge>
        <ada-badge>
          <span
            v-text="$t('oms.superBourseIndex')"
            class="tw-text-primary"
          ></span
          >:
          <span class="tw-text-sm badge-content"
            >{{ formatter.format(20136.69) }}
            <span
              v-text="
                `(${new Number(84.12).toLocaleString(appManager.locale)})`
              "
              class="tw-text-error"
            ></span>
          </span>
        </ada-badge>
      </div>
      <div class="end">
        <user-menu />
      </div>
    </header>
    <right-panel
      v-model:mini="rmini"
      v-model:clipped="clipped"
      v-model="rightMenu.drawer"
      class="shadow left"
    />
    <left-panel
      v-model:mini="lmini"
      v-model:clipped="clipped"
      v-model="leftMenu.drawer"
      class="shadow right"
    />
    <main
      class="dashboardmain-page"
      :class="{ right: !rightMenu.mini, left: !lmini }"
    >
      <div :class="['dashboardmain-nuxt', collaps ? 'collaps' : null]">
        <!-- <transition name="slide-fade" mode="out-in" appear>
        </transition> -->
        <nuxt-page />
      </div>
    </main>
    <bottom-panel
      class="dashboardmain-page"
      :class="{
        right: !rightMenu.mini,
        left: !lmini,
      }"
      :slideToBottom="invisibleFinInfo"
    />
    <footer
      v-if="!invisibleFinInfo"
      class="footer dashboardmain-page"
      :class="{
        right: !rightMenu.mini,
        left: !lmini,
      }"
    >
      <div class="summary">
        <ada-badge class="tw-ml-3"
          >{{ $t("accounting.account.amount") }}
          <span class="badge-content"> ۲٬۰۰۰٬۰۰۰</span>
        </ada-badge>
        <ada-badge class="tw-ml-3"
          >{{ $t("accounting.account.blockedAmount")
          }}<span class="badge-content">0</span></ada-badge
        >
        <ada-badge class="tw-ml-3">
          {{ $t("accounting.account.onlineBlockedAmount") }}
          <span class="badge-content">0</span>
        </ada-badge>
        <ada-badge class="tw-ml-3"
          >{{ $t("accounting.account.remaining")
          }}<span class="badge-content">0</span></ada-badge
        >
        <ada-badge class="tw-ml-3"
          >{{ $t("accounting.account.credit")
          }}<span class="badge-content">0</span></ada-badge
        >
      </div>
      <div class="cw">
        &copy; {{ new Date().getFullYear() }} {{ $t("general.company") }}
      </div>
    </footer>
    <ada-btn id="colopse-info-footer" class="floating-button">
      <ada-icon
        color="white"
        :size="24"
        @click="invisibleFinInfo = !invisibleFinInfo"
      >
        mdi-chevron-triple-right
      </ada-icon>
    </ada-btn>
    <ada-btn id="chat-footer" class="floating-button" @click="triggerChatRoom">
      <ada-icon color="white" :size="24"> isax-messages-2-bold </ada-icon>
    </ada-btn>
    <ada-snacks />
  </div>
</template>
