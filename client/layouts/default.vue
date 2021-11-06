<template>
  <v-app>
    <right-panel
      v-if="isLogin"
      :mini="rightMenu.mini"
      :clipped="clipped"
      v-model="rightMenu.drawer"
    />
    <left-panel
      v-if="isLogin"
      :mini="leftMenu.mini"
      :clipped="clipped"
      v-model="leftMenu.drawer"
    />
    <v-app-bar
      id="app-bar"
      :clipped-left="clipped"
      :clipped-right="clipped"
      :height="32"
      class="text-no-wrap"
      fixed
      app
      dense
    >
      <v-img src="/logo.png" max-width="24" />
      <span v-if="!rightMenu.mini && rightMenu.drawer">{{
        $t("general.proxyCompany")
      }}</span>
      <v-app-bar-nav-icon
        v-show="isLogin"
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
      >
        <v-icon>mdi-menu-open</v-icon>
      </v-app-bar-nav-icon>
      <clock :format="$t('general.date.longdt')" width="220" />
      <v-spacer />
      <v-badge
        v-if="isLogin"
        dot
        left
        color="green"
        class="mx-5"
        offset-y="75%"
        offset-x="-5"
      >
        {{ $t("oms.bourseIndex") }}: 0
      </v-badge>
      <v-badge
        v-if="isLogin"
        dot
        left
        color="orange"
        class="mx-5"
        offset-y="75%"
        offset-x="-5"
      >
        {{ $t("oms.superBourseIndex") }}:‌ 0
      </v-badge>
      <v-spacer />
      <v-btn v-if="!isLogin" color="success" nuxt to="/login" depressed>
        {{ $t("login.login") }}
        <v-icon>mdi-account-arrow-left</v-icon>
      </v-btn>
      <v-menu v-model="userMenu" v-if="isLogin" rounded="b-xl" offset-y>
        <template #activator="{ on, attrs }">
          <v-btn height="30" v-bind="attrs" v-on="on" class="ma-0 pa-0" depressed>
            <profile-picture
              :address="currentUser.profile && currentUser.profile.profilePic"
            />
            <span class="ms-4 .d-none .d-sm-flex">{{
              currentUser.userName
            }}</span>
            <v-icon class=".d-none .d-sm-flex">{{
              userMenu ? "mdi-chevron-up" : "mdi-chevron-down"
            }}</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-btn color="error" depressed @click="doLogout" small outlined>
              {{ $t("login.logout") }}
              <v-icon>mdi-account-arrow-right</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-badge class="ms-3" offset-y="35%" dot left color="error">
        <v-icon @click="leftMenu.drawer = !leftMenu.drawer">
          mdi-bell-outline
        </v-icon>
      </v-badge>
    </v-app-bar>
    <v-main class="dashboardmain-page">
      <div :class="{ 'dashboardmain-nuxt': true, collaps: collaps }">
        <nuxt />
      </div>
      <bottom-panel v-if="isLogin" />
    </v-main>
    <v-footer class="text-no-wrap ma-0 pa-0" :height="32" :absolute="true" app>
      <v-row dense>
        <v-col cols="2" sm="3" xs="5">
          <span>
            <v-icon small>mdi-account-group</v-icon>
            &copy; {{ new Date().getFullYear() }} {{ $t("general.company") }}
          </span>
        </v-col>
        <v-col cols="10" sm="9" xs="7" v-if="isLogin">
          <v-badge
            dot
            left
            class="ms-5"
            color="green"
            offset-y="75%"
            offset-x="-5"
            >{{ $t("accounting.account.amount") }}{{ brif.freeMoney }}</v-badge
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
            >{{ $t("accounting.account.credit") }}{{ brif.freeMoney }}</v-badge
          >
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
} from "@nuxtjs/composition-api";
import snackbar from "@/components/snacks.vue";
import ProfilePicture from "@/components/sso/profilePicture.vue";
import RightPanel from "@/components/rightPanel.vue";
import LeftPanel from "@/components/LeftPanel/index.vue";
import { User } from "@/types";

export default defineComponent({
  components: {
    snackbar,
    ProfilePicture,
    RightPanel,
    LeftPanel,
  },
  setup(props, context) {
    const router = useRouter();
    const store = useStore();
    const host = process.env.VUE_APP_Host;

    const isLogin = computed(() => store.getters["sso/user/isLogin"]);
    const collaps = computed(() => {
      const tab = store.getters["bottom-panel/activeTab"];
      return tab != null && tab != -1;
    });
    const currentUser: ComputedRef<User> = computed(
      () => store.getters["sso/user/me"] as User
    );
    const userMenu = ref(false);
    const blockedMoney = 0;
    const freeMoney = 0;
    const wlEditor = ref(null);
    const rightMenu = ref({
      mini: true,
      drawer: true,
    });
    const leftMenu = ref({
      mini: false,
      drawer: true,
    });

    const locale = computed(() => {
      return store.getters["locale"];
    });

    function doLogout() {
      store.dispatch("sso/user/logout");
      router.push("/login");
    }

    return {
      collaps,
      host,
      locale,
      wlEditor,
      doLogout,
      isLogin,
      currentUser,
      userMenu,
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

<style scoped>
.dashboardmain-page {
  background-color: #f9f9fb;
  overflow: auto;
}
.dashboardmain-nuxt {
  overflow-y: auto;
  height: calc(100vh - 64px);
  padding-bottom: 32px;
}
.dashboardmain-nuxt.collaps {
  height: calc(52vh);
}
</style>