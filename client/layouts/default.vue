<template>
  <v-app>
    <v-navigation-drawer
      v-if="isLogin"
      id="core-navigation-drawer"
      v-model="drawer"
      dark
      :expand-on-hover="true"
      :mini-variant="mini"
      :clipped="clipped"
      fixed
      app
      :right="rtl"
      color="secondary"
      mobile-breakpoint="960"
      width="260"
    >
      <template #img="props">
        <v-img :gradient="`to top, ${barColor}`" v-bind="props" />
      </template>
      <v-list v-model="selected">
        <v-list-item>
          <v-list-item-title>
            <v-spacer />
          </v-list-item-title>
        </v-list-item>
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
      dark
      app
      dense
      :clipped-right="true"
      color="primary"
    >
      <v-app-bar-nav-icon
        v-show="isLogin"
        color="accent"
        @click.stop="drawer = !drawer"
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
      v-model="drawer"
      dark
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
    <v-main>
      <nuxt />
      <v-footer v-if="isLogin" :absolute="true">
        <bot-panel />
      </v-footer>
    </v-main>
    <v-footer :absolute="true" app>
      <span>
        &copy; {{ new Date().getFullYear() }} {{ $t("general.company") }}
        <v-icon small>mdi-account-group</v-icon>
      </span>

      <span>
        {{ $t("accounting.account.blockedAmount") }}{{ blockedMoney }}
      </span>
      <span>{{ $t("accounting.account.amount") }}{{ freeMoney }} </span>
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
      barColor: "rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)",
      clipped: true,
      drawer: true,
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
