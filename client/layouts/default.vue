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
        <v-img
          :gradient="`to top, ${barColor}`"
          v-bind="props"
        />
      </template>
      <v-list v-model="selected">
        <v-list-item>
          <v-list-item-title>
            <span>دیدبان</span>
          </v-list-item-title>
        </v-list-item>

        <v-list-item
          v-for="(watchList, i) in watchLists"
          :key="i"
          :to="`/watchList/`+i"
          :watchList=watchList
          router
          exact
        >
          <v-list-item-content>
            <v-list-item-title v-text="i" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      id="app-bar"
      :clipped-left="!rtl"
      fixed
      dark
      app
      dense
      :clipped-right="rtl"
      color="primary"
    >
      <v-app-bar-nav-icon v-show="isLogin" color="accent" @click.stop="drawer=!drawer" />
      <v-toolbar-title v-if="isLogin" v-text="currentUser.name + ' ' + currentUser.lastName" />
      <v-spacer />
      <v-btn
        v-if="!isLogin"
        color="success"
        nuxt
        to="/login"
        depressed
      >
        {{ $t('login.login') }}
        <v-icon>mdi-account-arrow-left</v-icon>
      </v-btn>
      <v-btn
        v-if="isLogin"
        color="error"
        depressed
        @click="doLogout"
      >
        {{ $t('login.logout') }}
        <v-icon>mdi-account-arrow-right</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <nuxt />
    </v-main>
    <v-footer :absolute="true" app>
      <span>
        &copy; {{ new Date().getFullYear() }} {{ $t('company') }}
        <v-icon small>mdi-account-group</v-icon>
      </span>
    </v-footer>
    <snackbar />
  </v-app>
</template>

<script>
import colors from 'vuetify/es5/util/colors'
import { mapGetters, mapActions } from 'vuex'
import snackbar from '@/components/snacks'

export default {
  components: {
    snackbar
  },
  middleware: [
    'auth'
  ],
  data () {
    return {
      colors,
      barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
      clipped: true,
      drawer: true,
      mini: true,
      selected: {},
      items: [
        {
          icon: 'mdi-apps',
          title: 'menu.dashboard',
          to: '/'
        },
        {
          icon: 'mdi-chart-bar',
          title: 'menu.reports',
          to: '/inspire'
        },
        {
          icon: 'mdi-file-document-multiple-outline',
          title: 'menu.about',
          to: '/contents/hello'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'user/me',
      isLogin: 'user/isLogin',
      watchLists: 'user/getWatchList',
      rtl: 'rtl'
    })
  },
  methods: {
    ...mapActions({
      init: 'user/init',
      getMe: 'user/getMe',
      logout: 'user/logout'
    }),
    doLogout () {
      this.logout()
      this.$router.push('/login')
    }
  }
}
</script>
