<template>
  <v-app>
    <v-navigation-drawer
      v-if="isLogin"
      id="core-navigation-drawer"
      v-model="right_drawer"
      :mini-variant="mini"
      fixed
      app
      :right="rtl"
      mobile-breakpoint="960"
      width="220"
    >

      <v-list-item class="px-3">
        <v-list-item-avatar class=" ma-0">
          <v-img height = "20" width="20">logo</v-img>
        </v-list-item-avatar>
        <v-list-item-title class="mr-3">کارگزاری عصر دانش</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>
      
      <v-list v-model="selected">
        
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
      
      app
      dense
      color="primary"
    >
      <v-app-bar-nav-icon
        v-show="isLogin"
        color="accent"
        @click.stop="mini = !mini; if(!right_drawer) {right_drawer = true; mini = false}"
      />
      <v-toolbar-title v-if="isLogin" v-text="currentUser.user_name" />
      <v-spacer />
      <v-btn v-if="!isLogin" color="success" nuxt to="/login" depressed>
        {{ $t("login.login") }}
        <v-icon>mdi-account-arrow-left</v-icon>
      </v-btn>
      <v-btn v-if="isLogin" color="error" depressed @click="doLogout">
        {{ $t("login.logout") }}
        <v-icon>mdi-account-arrow-right</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-if="isLogin"
      id="core-navigation-drawer"
      v-model="left_drawer"
      :expand-on-hover="true"
      :mini-variant="mini"
      :clipped="clipped"
      fixed
      app
      :right="!rtl"
      color="secondary"
      mobile-breakpoint="960"
      width="260"
    >
      <left-panel />
    </v-navigation-drawer>
    <v-main class="background: grey lighten-4 mt-3 mx-3">

      <nuxt />
      <v-footer v-if="isLogin" :absolute="true" class="ma-0 pa-0">
        <bot-panel />
      <span>
        {{ $t("accounting.account.blockedAmount") }}{{ blockedMoney }}
      </span>
      <span>{{ $t("accounting.account.amount") }}{{ freeMoney }} </span>
      </v-footer>
    </v-main>
    <v-footer :absolute="true" app>
      <span>
        &copy; {{ new Date().getFullYear() }} {{ $t("general.company") }}
        <v-icon small>mdi-account-group</v-icon>
      </span>
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
} from "@nuxtjs/composition-api";
import colors from "vuetify/es5/util/colors";
import snackbar from "@/components/snacks";
import botPanel from "@/components/bottom-panel.vue";
import leftPanel from "@/components/left-panel.vue";
import watchListEditor from "@/components/sso/watchList/watchListEditor";

export default defineComponent({
  components: {
    snackbar,
    watchListEditor,
    "bot-panel": botPanel,
    "left-panel": leftPanel,
  },
  setup(props, context) {
    let dialog = ref(false);
    const store = useStore();
    const isLogin = computed(() => store.getters["user/isLogin"]);
    const rtl = computed(() => store.getters["rtl"]);
    const currentUser = computed(() => store.getters["user/me"]);
    const blockedMoney = 0;
    const freeMoney = 0;
    const wlEditor = ref(null);

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
      this.$router.push("/login");
    }

    return {
      wlEditor,
      togDialog,
      dialog,
      doLogout,
      isLogin,
      rtl,
      currentUser,
      colors,
      barColor: "white, red",
      clipped: false,
      left_drawer: true,
      right_drawer: true,
      mini: true,
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
