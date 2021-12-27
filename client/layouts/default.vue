<template>
  <v-app :class="locale">
    <right-panel
      v-if="isLogin"
      :mini.sync="rightMenu.mini"
      :clipped="clipped"
      v-model="rightMenu.drawer"
      class="min32"
    />
    <left-panel
      v-if="isLogin"
      :mini.sync="leftMenu.mini"
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
      <span v-if="!rightMenu.mini && rightMenu.drawer">{{
        $t("general.proxyCompany")
      }}</span>
      <v-app-bar-nav-icon
        class="ps-2 me-5"
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
      <clock :format="$t('general.date.longdt')" width="240" />
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
        {{ $t("oms.bourseIndex") }}: {{ formatter.format(0.0) }}
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
        {{ $t("oms.superBourseIndex") }}:‌ {{ formatter.format(0.0) }}
      </v-badge>
      <v-spacer />
      <v-btn
        v-if="!isLogin"
        color="success"
        nuxt
        to="/login"
        height="28"
        depressed
      >
        {{ $t("login.login") }}
        <v-icon>mdi-account-arrow-left</v-icon>
      </v-btn>
      <v-menu v-model="userMenu" v-if="isLogin" offset-y>
        <template #activator="{ on, attrs }">
          <v-btn
            height="28"
            min-width="184px"
            v-bind="attrs"
            v-on="on"
            class="ma-0 pa-0 ps-3 justify-start"
            depressed
          >
            <profile-picture
              :address="currentUser.profile && currentUser.profile.profilePic"
            />
            <span class=".d-none .d-sm-flex">{{ currentUser.userName }}</span>
            <v-spacer />
            <v-icon class=".d-none .d-sm-flex">{{
              userMenu ? "mdi-chevron-up" : "mdi-chevron-down"
            }}</v-icon>
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
      <div
        :class="{ 'dashboardmain-nuxt': isLogin, collaps: isLogin && collaps }"
      >
        <nuxt />
      </div>
      <bottom-panel v-if="isLogin" />
    </v-main>
    <v-footer class="text-no-wrap ma-0 pa-0" :height="32" :absolute="true" app>
      <v-row dense>
        <v-col cols="1.5" sm="2" xs="5" class="ma-0 pa-0 ps-5 pt-2">
          <v-icon small>mdi-account-group</v-icon>
          &copy; {{ new Date().getFullYear() }} {{ $t("general.company") }}
        </v-col>
        <v-col cols="9" sm="8" xs="7" class="ma-0 pa-0">
          <span v-if="isLogin">
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
import { User } from "@/types";
import { useShortcut } from "@/utils/shortcutManager";

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
        icon: "mdi-application-cog-outline",
        click: () => {
          store.commit("editMode", true);
        },
        title: "menu.edit-dashboard",
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
    const isLogin = computed(() => store.getters["sso/user/isLogin"]);
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
      isLogin,
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

<style scoped>
.dashboardmain-page {
  background-color: #f9f9fb;
  overflow: auto;
}
.dashboardmain-nuxt {
  overflow-y: auto;
  height: calc(100vh - 67px);
  padding-bottom: 32px;
}
.dashboardmain-nuxt.collaps {
  height: calc(52vh);
}
</style>