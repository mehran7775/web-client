<template>
  <v-app>
    <v-navigation-drawer
      v-if="isLogin"
      id="core-navigation-drawer"
      v-model="drawer"
      :expand-on-hover="mini"
      :mini-variant="mini"
      :clipped="clipped"
      fixed
      app
      :right="rtl"
      width="260"
    >
      <right-panel @openWatchList="togDialog" />
    </v-navigation-drawer>
    <v-app-bar
      id="app-bar"
      :clipped-left="true"
      fixed
      app
      dense
      :clipped-right="true"
    >
      <v-img src="/logo.png" max-width="24" />
      <span v-if="!mini && drawer">
        {{ $t("general.proxyCompany") }}
      </span>
      <v-app-bar-nav-icon
        v-show="isLogin"
        @click.stop="
          () => {
            if (drawer) {
              mini = !mini;
            } else {
              drawer = true;
              mini = false;
            }
          }
        "
      >
        <v-icon> mdi-menu-open </v-icon>
      </v-app-bar-nav-icon>
      {{ moment(date).locale(locale).format($t("general.date.longdt")) }}
      <v-spacer />
      <v-col>
        <v-badge
          dot
          left
          color="green"
          class="ms-5"
          offset-y="75%"
          offset-x="-5"
        >
          {{ $t("oms.bourseIndex") }}: 0
        </v-badge>
      </v-col>
      <v-col>
        <v-badge
          dot
          left
          color="orange"
          class="my-5"
          offset-y="75%"
          offset-x="-5"
        >
          {{ $t("oms.superBourseIndex") }}:‌ 0</v-badge
        >
      </v-col>
      <v-spacer />
      <v-btn v-if="!isLogin" color="success" nuxt to="/login" depressed>
        {{ $t("login.login") }}
        <v-icon>mdi-account-arrow-left</v-icon>
      </v-btn>
      <v-menu v-model="userMenu" v-if="isLogin" rounded="b-xl" offset-y>
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" depressed>
            <profile-picture
              :address="currentUser.profile && currentUser.profile.profilePic"
            />
            <span class="ms-4 .d-none .d-sm-flex">
              {{ currentUser.user_name }}
            </span>
            <v-icon class=".d-none .d-sm-flex">
              {{ userMenu ? "mdi-chevron-up" : "mdi-chevron-down" }}
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-btn v-if="isLogin" color="error" depressed @click="doLogout">
              {{ $t("login.logout") }}
              <v-icon>mdi-account-arrow-right</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
      v-if="isLogin"
      id="core-navigation-drawer"
      v-model="left_drawer"
      :mini-variant="left_mini"
      :clipped="clipped"
      fixed
      app
      :right="!rtl"
      color="white"
      width="260"
    >
      <left-panel
        @open="left_mini = false"
        @close="left_mini = true"
        :isExpanded="left_mini"
      />
    </v-navigation-drawer>
    <v-main class="dashboardmain-page">
      <nuxt class="mb-12" />
      <bottom-panel v-if="isLogin" />
    </v-main>
    <v-footer :absolute="true" app>
      <v-row>
        <v-col md="2" xs="5">
          <span>
            <v-icon small>mdi-account-group</v-icon>
            &copy; {{ new Date().getFullYear() }} {{ $t("general.company") }}
          </span>
        </v-col>
        <v-col md="10" xs="7" v-if="isLogin">
          <v-badge
            dot
            left
            class="ms-5"
            color="green"
            offset-y="75%"
            offset-x="-5"
          >
            {{ $t("accounting.account.amount") }}{{ brif.freeMoney }}
          </v-badge>

          <v-badge
            dot
            left
            class="ms-5"
            color="red"
            offset-y="75%"
            offset-x="-5"
          >
            {{ $t("accounting.account.blockedAmount") }}{{ brif.blockedMoney }}
          </v-badge>

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
          >
            {{ $t("accounting.account.remaining") }}{{ brif.freeMoney }}
          </v-badge>

          <v-badge
            dot
            left
            class="ms-5"
            color="#89abcd"
            offset-y="75%"
            offset-x="-5"
          >
            {{ $t("accounting.account.credit") }}{{ brif.freeMoney }}
          </v-badge>
        </v-col>
      </v-row>
    </v-footer>
    <v-dialog
      v-if="isLogin"
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <watch-list-editor @close="dialog = false" />
    </v-dialog>
    <snackbar />
  </v-app>
</template>

<script>
import {
  defineComponent,
  computed,
  useStore,
  ref,
  useRouter,
} from "@nuxtjs/composition-api";
import snackbar from "@/components/snacks.vue";
import watchListEditor from "@/components/dashboard/watchListEditor.vue";
import ProfilePicture from "@/components/sso/profilePicture.vue";
import moment from "moment-jalaali";
import RightPanel from "~/components/rightPanel.vue";

export default defineComponent({
  components: {
    snackbar,
    watchListEditor,
    ProfilePicture,
    RightPanel,
  },
  setup(props, context) {
    moment.loadPersian();
    let dialog = ref(false);
    const router = useRouter();
    const store = useStore();
    const isLogin = computed(() => store.getters["user/isLogin"]);
    const rtl = computed(() => store.getters["rtl"]);
    const currentUser = computed(() => store.getters["user/me"]);
    const userMenu = ref(false);
    const blockedMoney = 0;
    const freeMoney = 0;
    const wlEditor = ref(null);
    const date = ref(Date());
    setInterval(() => {
      date.value = Date();
    }, 1000);

    const locale = computed(() => {
      return store.getters["locale"];
    });

    function togDialog() {
      console.log("tog")
      dialog.value = !dialog.value;
    }

    function doLogout() {
      store.dispatch("user/logout");
      router.push("/login");
    }

    return {
      date,
      moment,
      locale,
      wlEditor,
      togDialog,
      dialog,
      doLogout,
      isLogin,
      rtl,
      currentUser,
      userMenu,
      clipped: true,
      drawer: true,
      mini: true,
      left_drawer: true,
      left_mini: true,
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
}
</style>