<template>
  <v-app :class="locale">
    <right-panel
      :mini.sync="rightMenu.mini"
      :clipped="clipped"
      v-model="rightMenu.drawer"
      class="min32 shadow left"
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
      <img class="me-1" src="/logo.png" height="20px" width="20px" />
      <span v-if="!rightMenu.mini && rightMenu.drawer">
        {{ $t("general.proxyCompany") }}
      </span>

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
        class="ma-0 pa-0 me-5"
        size="18"
      >
        mdi-menu-open
      </v-icon>

      <clock :format="$t('general.date.longdt')" width="240" />
      <div class="center">
        <v-badge
          dot
          left
          color="green"
          class="mx-5"
          offset-y="75%"
          offset-x="-5"
        >
          {{ $t("oms.bourseIndex") }}: {{ formatter.format(0.0) }}
        </v-badge>
        <v-badge
          dot
          left
          color="orange"
          class="mx-5"
          offset-y="75%"
          offset-x="-5"
        >
          {{ $t("oms.superBourseIndex") }}: {{ formatter.format(0.0) }}
        </v-badge>
      </div>
      <v-spacer />
      <v-menu v-model="userMenu" offset-y>
        <template #activator="{ on, attrs }">
          <v-btn
            height="28"
            min-width="184px"
            v-bind="attrs"
            v-on="on"
            class="ma-0 pa-0 px-3 justify-start"
            depressed
          >
            <profile-picture
              :address="currentUser.profile && currentUser.profile.profilePic"
            />
            <span class=".d-none .d-sm-flex">{{
              currentUser.profile.nickname
                ? currentUser.profile.nickname
                : currentUser.userName
            }}</span>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-for="item in userMenuItems"
            :key="item.title"
            :to="item.to"
            @click="
              () => {
                if (item.click) item.click();
              }
            "
          >
            <v-icon :color="item.color">{{ item.icon }}</v-icon>
            <v-list-item-title :class="item.color + '--text'">
              {{ $t(item.title) }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main class="dashboardmain-page">
      <div :class="{ 'dashboardmain-nuxt': true, collaps: collaps }">
        <nuxt />
      </div>
      <bottom-panel />
    </v-main>
    <v-footer class="text-no-wrap ma-0 pa-0" :height="32" :absolute="true" app>
      <v-row dense>
        <v-col cols="1.5" sm="2" xs="5" class="ma-0 pa-0 ps-5 pt-2">
          <v-icon small>mdi-account-group</v-icon>
          &copy; {{ new Date().getFullYear() }} {{ $t("general.company") }}
        </v-col>
        <v-col cols="9" sm="8" xs="7" class="ma-0 pa-0">
          <span>
            <v-badge
              dot
              left
              class="ms-5"
              color="green"
              offset-y="75%"
              offset-x="-5"
              >{{ $t("accounting.account.amount")
              }}{{ brif.freeMoney }}</v-badge
            >

            <v-badge
              dot
              left
              class="ms-5"
              color="red"
              offset-y="75%"
              offset-x="-5"
              >{{ $t("accounting.account.blockedAmount")
              }}{{ brif.blockedMoney }}</v-badge
            >

            <v-badge
              dot
              left
              class="ms-5"
              color="orange"
              offset-y="75%"
              offset-x="-5"
            >
              {{ $t("accounting.account.onlineBlockedAmount")
              }}{{ brif.freeMoney }}
            </v-badge>

            <v-badge
              dot
              left
              class="ms-5"
              color="blue"
              offset-y="75%"
              offset-x="-5"
              >{{ $t("accounting.account.remaining")
              }}{{ brif.freeMoney }}</v-badge
            >

            <v-badge
              dot
              left
              class="ms-5"
              color="#89abcd"
              offset-y="75%"
              offset-x="-5"
              >{{ $t("accounting.account.credit")
              }}{{ brif.freeMoney }}</v-badge
            >
          </span>
        </v-col>
        <v-col cols="1.5" sm="2" class="ma-0 pa-0">
          <v-spacer />
          <v-btn depressed height="28" @click="() => redirect('/about-us')">
            {{ $t("login.about-us") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-footer>
    <snackbar />
  </v-app>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ComputedRef,
  useStore,
  ref,
  useRouter,
  useContext,
} from "@nuxtjs/composition-api";
import snackbar from "@/components/snacks.vue";
import ProfilePicture from "@/components/sso/profilePicture.vue";
import { User, WealthSearchModel } from "@/types";

export default defineComponent({
  components: {
    snackbar,
    ProfilePicture,
  },
  setup(props, context) {
    const router = useRouter();
    const store = useStore();
    const host = process.env.VUE_APP_Host;
    const ctx = useContext();
    const userMenu = ref(false);
    const blockedMoney = 0;
    const freeMoney = 0;
    const wlEditor = ref(null);
    const rightMenu = ref({
      mini: true,
      drawer: true,
    });
    const leftMenu = ref({
      mini: true,
      drawer: true,
    });
    const userMenuItems = [
      {
        icon: "mdi-account-cog",
        to: "/user/",
        title: "menu.profile",
      },
      {
        icon: "mdi-logout",
        color: "error",
        click: doLogout,
        title: "login.logout",
      },
    ];

    const locale = computed(() => {
      return store.getters["locale"];
    });
    const formatter: ComputedRef<Intl.NumberFormat> = computed(
      () => store.getters["formatter"] as Intl.NumberFormat
    );
    const collaps = computed(() => {
      const tab = store.getters["bottom-panel/activeTab"];
      return tab != null && tab != -1;
    });
    const currentUser: ComputedRef<User> = computed(
      () => store.getters["sso/user/me"] as User
    );

    function doLogout() {
      userMenu.value = false;
      store.dispatch("sso/user/logout");
      router.push("/login");
    }

    return {
      formatter,
      collaps,
      host,
      locale,
      wlEditor,
      doLogout,
      redirect: ctx.redirect,
      currentUser,
      userMenu,
      userMenuItems,
      rightMenu,
      leftMenu,
      clipped: true,
      brif: {
        blockedMoney,
        freeMoney,
      },
    };
  },
});
</script>

<style lang="sass">
.shadow
  border: none !important
  &.bottom
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.05) !important
  &.right
    box-shadow: 4px 0px 4px 0px rgba(0, 0, 0, 0.05) !important
  &.left
    box-shadow: -4px 0px 4px 0px rgba(0, 0, 0, 0.05)

  .v-navigation-drawer__border
    display: none !important
</style>

<style scoped>
.center {
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  width: fit-content;
}
.dashboardmain-page {
  background-color: var(--v-defualt-bg-base);
  overflow: auto;
}
.dashboardmain-nuxt {
  overflow-y: auto;
  height: calc(100vh - 74px);
  padding-bottom: 32px;
}
.dashboardmain-nuxt.collaps {
  height: calc(52vh);
}
</style>