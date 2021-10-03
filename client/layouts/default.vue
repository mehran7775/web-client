<template>
  <v-app>
    <v-navigation-drawer
      v-if="isLogin"
      id="core-navigation-drawer"
      v-model="drawer"
      :expand-on-hover="true"
      :mini-variant="mini"
      :clipped="clipped"
      fixed
      app
      :right="rtl"
      mobile-breakpoint="960"
      width="260"
    >
      <v-list v-model="selected" dense>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="$t(item.title)" />
            <v-list-item-group v-if="item.children">
              <v-list-item
                v-for="subitem in item.children.value"
                :key="subitem.title"
                :to="subitem.to"
                @click="subitem.click ? subitem.click() : null"
                router
                exact
              >
                <v-list-item-action>
                  <v-icon>{{ subitem.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="subitem.title" />
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list-item-content>
        </v-list-item>
      </v-list>
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
      {{ $t("general.proxyCompany") }}
      <v-app-bar-nav-icon v-show="isLogin" @click.stop="drawer = !drawer">
        <v-icon>
          mdi-menu-open
        </v-icon>
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
            <span class="ms-4">
              {{ currentUser.user_name }}
            </span>
            <v-icon
              >{{ userMenu ? "mdi-chevron-up" : "mdi-chevron-down" }}
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
      mobile-breakpoint="960"
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
          <v-badge dot left class="ms-5" offset-y="75%" offset-x="-5">
            {{ $t("accounting.account.amount") }}{{ freeMoney }}
          </v-badge>

          <v-badge dot left class="ms-5" offset-y="75%" offset-x="-5">
            {{ $t("accounting.account.blockedAmount") }}{{ blockedMoney }}
          </v-badge>

          <v-badge dot left class="ms-5" offset-y="75%" offset-x="-5">
            {{ $t("accounting.account.onlineBlockedAmount") }}{{ freeMoney }}
          </v-badge>

          <v-badge dot left class="ms-5" offset-y="75%" offset-x="-5">
            {{ $t("accounting.account.remaining") }}{{ freeMoney }}
          </v-badge>

          <v-badge dot left class="ms-5" offset-y="75%" offset-x="-5">
            {{ $t("accounting.account.credit") }}{{ freeMoney }}
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
import colors from "vuetify/es5/util/colors.js";
import snackbar from "@/components/snacks.vue";
import watchListEditor from "@/components/dashboard/WatchList.vue";
import ProfilePicture from "@/components/sso/profilePicture.vue";
import moment from "moment-jalaali";

export default defineComponent({
  components: {
    snackbar,
    watchListEditor,
    ProfilePicture,
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

    const watchList = computed(() => {
      const lists = store.getters["user/watchList"];
      const res = [
        {
          icon: "mdi-pen",
          click: togDialog,
        },
      ];
      for (let k in lists) {
        res.push({
          title: k,
          to: "/watchList/" + k,
        });
      }
      return res;
    });

    function togDialog() {
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
      colors,
      barColor: "rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)",
      clipped: true,
      drawer: true,
      mini: true,
      left_drawer: true,
      left_mini: true,
      selected: {},
      items: [
        {
          icon: "mdi-eye",
          title: "menu.watchList",
          children: watchList,
        },
        {
          icon: "mdi-chart-bar",
          title: "menu.reports",
          to: "/inspire",
        },
      ],
      blockedMoney,
      freeMoney,
    };
  },
});
</script>

<style scoped>
.dashboardmain-page {
  background-color: #f9f9fb;
}
</style>