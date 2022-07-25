<script setup lang="ts">
import { defaultItem } from "@/types"
import { computed, ref, watch } from "#app";
import snackbar from "@/components/snacks.vue";
import { useAsrTrader, useUser, useBottomPanel, useWealth, useWebSocket } from "~/composables";
import AdaMenu from '@/components/ada-menu.vue'
const appManager = useAsrTrader();
const userManager = useUser();
const bottomPanelManager = useBottomPanel();
const wealthManager = useWealth();

const wbsocket = useWebSocket();
// const wbsocket = useWebSocket();


wealthManager.getActiveRestrictions();

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
    if (!lmini.value) lmini.value = true
  }
})

const lmini = computed({
  get: () => bottomPanelManager.LeftPanelMini,
  set(val) {
    bottomPanelManager.LeftPanelMini = val
    if (!rightMenu.value.mini) rightMenu.value.mini = true
  }
})

lmini.value = true;

const locale = appManager.locale;
const formatter = appManager.formatter;
const collaps = computed(() => {
  const tab = bottomPanelManager.activeTab;
  return tab && tab != defaultItem;
});
const home = computed(() => userManager.me.settings?.home);
const clipped = ref(true);
const invisibleFinInfo = ref(false);
const rtl = computed(() => appManager.rtl);
// const unitPanel = computed(() => {
//   if(rightMenu.value.mini)
// });



</script>

<style lang="postcss">
.page {
  @apply tw-relative tw-w-full tw-h-full;
}


.shadow {
  border: none !important;

  &.bottom {
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.05) !important;
  }

  &.right {
    box-shadow: 4px 0px 4px 0px rgba(0, 0, 0, 0.05) !important;
  }

  &.left {
    box-shadow: -4px 0px 4px 0px rgba(0, 0, 0, 0.05);
  }

  .v-navigation-drawer__border {
    display: none !important;
  }
}
</style>

<style lang="postcss" scoped>
#app-bar {
  z-index: 1000;
}

.center {
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  width: fit-content;
}

.footer {
  @apply tw-whitespace-nowrap tw-flex-nowrap tw-flex tw-flex-grow tw-justify-end tw-w-full;
  height: 32px;
  align-items: center;
  position: fixed;
  bottom: 0;

  .summary {
    @apply tw-flex;
    align-self: center;

    .badge-content {
      min-width: 60px;
      @apply tw-mr-1;
    }
  }

  .cw {
    @apply tw-flex;
    align-self: flex-end;
    color: rgba(var(--c-default), 0.5);
  }
}

.drawer-activator {
  &.open {
    transform: rotate(-180deg);
  }
}

.dashboardmain-page {
  background-color: rgba(var(--c-primary), 0.05);
  overflow: auto;
  @apply tw-transition-all tw-ease-in-out tw-duration-700;
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
    content: '';
  }
}

@media (min-width: 960px) {
  .footer {
    max-width: calc(100% - 96px);

    &.left {
      max-width: calc(100% - 304px);

      &.right {
        max-width: calc(100% - 408px);
      }
    }

    &.right {
      max-width: calc(100% - 304px);
    }
  }

  .dashboardmain-page {
    padding-left: 48px !important;
    padding-right: 48px !important;

    &.left {
      padding-left: 256px !important;
    }

    &.right {
      padding-right: 256px !important;
    }
  }
}

@media (max-width: 959px) {
  .dashboardmain-page {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}

.dashboardmain-nuxt {
  overflow-y: auto;
  height: calc(100vh - 106px);
  position: relative;

  &.collaps {
    height: 362px;
  }
}
</style>


<template>
  <div class="page" :class="[locale, rtl ? 'rtl' : 'ltr']">
    <v-app>
      <right-panel :mini.sync="rmini" :clipped="clipped" v-model="rightMenu.drawer" class="shadow left" />
      <left-panel :mini.sync="lmini" :clipped="clipped" v-model="leftMenu.drawer" class="shadow right" />
      <v-app-bar id="app-bar" :clipped-left="clipped" :clipped-right="clipped" :height="42" color="defualt-bg"
        class="text-no-wrap shadow bottom pe-2" fixed app dense>
        <nuxt-link class="d-flex flex-row px-2" :to="home">
          <img class="ma-0 pa-0 me-1" src="/logo.png" height="20px" width="20px" />
          <span v-if="!rightMenu.mini && rightMenu.drawer">
            {{ $t("general.proxyCompany") }}
          </span>
        </nuxt-link>
        <ada-icon @click.stop="
          () => {
            if (rightMenu.drawer) {
              rightMenu.mini = !rightMenu.mini;
              if (!rightMenu.mini) lmini = true
            } else {
              rightMenu.drawer = true;
              rightMenu.mini = false;
            }
          }
        " :class="['tw-m-0', 'tw-p-0', 'te-mx-[5px]', 'drawer-activator'
, !rightMenu.mini && rightMenu.drawer ? 'open' : '']" :size="18">
          mdi-menu-open
        </ada-icon>

        <clock :format="$t('general.date.longdt')" width="240px" />
        <div class="center tw-flex">
          <ada-badge class="tw-mx-5" color="green">
            <span v-text="$t('oms.bourseIndex')" class="tw-text-primary"></span>: <span
              class="tw-text-sm badge-content">{{ formatter.format(1502605.15) }}
              <span v-text="`(${new Number(8471.09).toLocaleString(appManager.locale)})`" class="tw-text-red"></span>
            </span>
          </ada-badge>
          <ada-badge color="orange">
            <span v-text="$t('oms.superBourseIndex')" class="tw-text-primary"></span>: <span
              class="tw-text-sm badge-content">{{ formatter.format(20136.69) }}
              <span v-text="`(${new Number(84.12).toLocaleString(appManager.locale)})`" class="tw-text-red"></span>
            </span>
          </ada-badge>
        </div>
        <ada-spacer />
        <user-menu />
      </v-app-bar>
      <v-main :class="{
        'dashboardmain-page': true,
        right: !rightMenu.mini,
        left: !lmini,
      }">
        <div :class="['dashboardmain-nuxt', collaps ? 'collaps' : '']">
          <nuxt />
        </div>
        <bottom-panel :class="{
          right: !rightMenu.mini,
          left: !lmini,
        }" :slideToBottom="invisibleFinInfo" />
        <footer v-if="!invisibleFinInfo" class="mainBackground" :class="{
          footer: true,
          right: !rightMenu.mini,
          left: !lmini,
        }">
          <div class="summary center">
            <ada-badge color="green" class="tw-ml-3">{{ $t("accounting.account.amount")
            }}
              <span class="badge-content"> ۲٬۰۰۰٬۰۰۰</span>
            </ada-badge>
            <ada-badge color="red" class="tw-ml-3">{{
                $t("accounting.account.blockedAmount")
            }}<span class="badge-content">0</span></ada-badge>
            <ada-badge color="orange" class="tw-ml-3">
              {{ $t("accounting.account.onlineBlockedAmount") }}
              <span class="badge-content">0</span>
            </ada-badge>
            <ada-badge color="blue" class="tw-ml-3">{{
                $t("accounting.account.remaining")
            }}<span class="badge-content">0</span></ada-badge>
            <ada-badge color="skyblue" class="tw-ml-3">{{
                $t("accounting.account.credit")
            }}<span class="badge-content">0</span></ada-badge>
          </div>
          <div class="cw">
            &copy; {{ new Date().getFullYear() }} {{ $t("general.company") }}
          </div>
        </footer>
      </v-main>
      <floating-button :style="{
        bottom: '8px',
        left: '8px',
      }" width="32px" height="32px" color="primary 0.9">
        <ada-icon color="white" :size="24" @click="invisibleFinInfo = !invisibleFinInfo">
          mdi-chevron-triple-right
        </ada-icon>
      </floating-button>
      <floating-button :style="{
        bottom: '8px',
        right: '8px',
      }" width="32px" height="32px" color="primary 0.9">
        <ada-icon color="white" :size="24"> isax-messages-2-bold </ada-icon>
      </floating-button>
    </v-app>
    <snackbar />
    <!-- <transition name="slide-fade">
      <ada-menu v-if="menu.state.active" :left="menu.state.left" :top="menu.state.top">
        <div class="tw-rounded-b-md tw-bg-white tw-shadow-md" v-for="item in menu.state.content" v-html="item"></div>
      </ada-menu>
    </transition> -->
    <ada-menu :display="true" ref="contextMenu"></ada-menu>
  </div>
</template>
