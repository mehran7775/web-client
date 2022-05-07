<script setup lang="ts">
import { computed, ref } from "#app";
import snackbar from "@/components/snacks.vue";
import { useAsrTrader, useUser, useBottomPanel } from "~/composables";

const appManager = useAsrTrader();
const userManager = useUser();
const bottomPanelManager = useBottomPanel();

const rightMenu = ref({
  mini: true,
  drawer: true,
});
const leftMenu = ref({
  mini: true,
  drawer: true,
});

const locale = appManager.locale;
const formatter = appManager.formatter;
const collaps = computed(() => {
  const tab = bottomPanelManager.activeTab;
  return tab != null && tab != -1;
});

const home = computed(() => userManager.me.settings.home);
const clipped = ref(true);
const rtl = computed(() => appManager.rtl);
</script>

<template>
  <v-app :class="locale">
    <right-panel
      :mini.sync="rightMenu.mini"
      :clipped="clipped"
      v-model="rightMenu.drawer"
      class="shadow left"
    />
    <left-panel
      :mini.sync="leftMenu.mini"
      :clipped="clipped"
      v-model="leftMenu.drawer"
      class="shadow right"
    />
    <v-app-bar
      id="app-bar"
      :clipped-left="clipped"
      :clipped-right="clipped"
      :height="42"
      color="defualt-bg"
      class="text-no-wrap shadow bottom pe-2"
      fixed
      app
      dense
    >
      <nuxt-link class="d-flex flex-row px-2" :to="home">
        <img class="ma-0 pa-0 me-1" src="/logo.png" height="20px" width="20px" />
        <span v-if="!rightMenu.mini && rightMenu.drawer">
          {{ $t("general.proxyCompany") }}
        </span>
      </nuxt-link>
      <v-icon
        @click.stop="
          () => {
            if (rightMenu.drawer) {
              rightMenu.mini = !rightMenu.mini;
            } else {
              rightMenu.drawer = true;
              rightMenu.mini = false;
            }
          }
        "
        :class="[
          'ma-0',
          'pa-0',
          'me-5',
          'drawer-activator',
          !rightMenu.mini && rightMenu.drawer ? 'open' : '',
        ]"
        size="18"
      >
        mdi-menu-open
      </v-icon>

      <clock :format="$t('general.date.longdt')" width="240px" />
      <div class="center">
        <v-badge dot left color="green" class="mx-5" offset-y="75%" offset-x="-5">
          {{ $t("oms.bourseIndex") }}: {{ formatter.format(0.0) }}
        </v-badge>
        <v-badge dot left color="orange" class="mx-5" offset-y="75%" offset-x="-5">
          {{ $t("oms.superBourseIndex") }}: {{ formatter.format(0.0) }}
        </v-badge>
      </div>
      <v-spacer />
      <user-menu />
    </v-app-bar>
    <v-main
      :class="{
        'dashboardmain-page': true,
        right: !rightMenu.mini,
        left: !leftMenu.mini,
        rtl: rtl,
      }"
    >
      <div :class="{ 'dashboardmain-nuxt': true, collaps: collaps }">
        <nuxt />
      </div>
      <bottom-panel />
      <footer class="footer">
        <div class="summary center">
          <v-badge dot left class="ms-5" color="green" offset-y="75%" offset-x="-5"
            >{{ $t("accounting.account.amount") }}0</v-badge
          >
          <v-badge dot left class="ms-5" color="red" offset-y="75%" offset-x="-5"
            >{{ $t("accounting.account.blockedAmount") }}0</v-badge
          >
          <v-badge dot left class="ms-5" color="orange" offset-y="75%" offset-x="-5">
            {{ $t("accounting.account.onlineBlockedAmount") }}0
          </v-badge>
          <v-badge dot left class="ms-5" color="blue" offset-y="75%" offset-x="-5"
            >{{ $t("accounting.account.remaining") }}0</v-badge
          >
          <v-badge dot left class="ms-5" color="#89abcd" offset-y="75%" offset-x="-5"
            >{{ $t("accounting.account.credit") }}0</v-badge
          >
        </div>
        <div class="cw">
          &copy; {{ new Date().getFullYear() }} {{ $t("general.company") }}
        </div>
      </footer>
    </v-main>
    <floating-button
      bottom="8px"
      right="8px"
      width="32px"
      height="32px"
      z-index="1000"
      small
      color="primary lighten-1"
      depressed
    >
      <v-icon> isax-messages-2-bold </v-icon>
    </floating-button>
    <snackbar />
  </v-app>
</template>

<style lang="postcss">
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
.center {
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  width: fit-content;
}
.footer {
  @apply tw-whitespace-nowrap tw-flex-nowrap tw-flex tw-flex-grow tw-justify-end;
  height: 32px;
  align-items: center;
  position: fixed;
  bottom: 0;
  width: calc(100% - 96px);
  .summary {
    @apply tw-flex;
    align-self: center;
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
}

@media (min-width: 960px) {
  .dashboardmain-page {
    padding-left: 48px !important;
    padding-right: 48px !important;
    &.left {
      padding-left: 152px !important;
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
}

.dashboardmain-nuxt.collaps {
  height: 362px;
}
</style>
