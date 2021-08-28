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
            <v-list v-if="item.children">
              <v-list-item
                v-for="subitem in item.children.value"
                :key="subitem.title"
                :to="subitem.to"
                router
                exact
              >
              <v-list-item-content>
                <v-list-item-title v-text="subitem.title" />
              </v-list-item-content>
              </v-list-item>
            </v-list>
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
import { defineComponent, ref, computed, useStore } from "@nuxtjs/composition-api";
import colors from 'vuetify/es5/util/colors'
import { mapGetters, mapActions } from 'vuex'
import snackbar from '@/components/snacks'

export default defineComponent({
  components: {
    snackbar
  },
  setup(props, context) {
    const store = useStore()
    const isLogin = computed(() => store.getters['user/isLogin']);
    const rtl = computed(() => store.getters['rtl']);
    const currentUser = computed(() => store.getters['user/me'])

    const watchList = computed(()=> {
        const lists = store.getters['user/watchList']
        const res = []
        for(let k in lists) {
          res.push({
            title: k,
            to: '/watchList/' + k
          })
        }
        return res
    });

    const getMe = () => store.dispatch('user/getMe')
    const logout= () => store.dispatch('user/logout');

    function doLogout() {
      logout()
      this.$router.push('/login')
    }

    return {
      doLogout,
      getMe,
      isLogin,
      rtl,
      currentUser,
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
          children: watchList
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'menu.reports',
          to: '/inspire'
        }
      ]
    }
  }
})

</script>
