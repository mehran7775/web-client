<template>
  <v-card class="mx-auto mt-5" max-width="400">
    <v-card-title>{{ $t('login.login') }}</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="userName"
        outlined
        :label="$t('user.username')"
        prepend-icon="mdi-account-circle"
        dense
      >
      </v-text-field>
      <v-text-field
        v-model="password"
        outlined
        dense
        :label="$t('user.password')"
        :type="showPassword ? 'text' : 'Password'"
        prepend-icon="mdi-lock"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        @keyup.enter="login"
      >
      </v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn color="success" @click="login">
        {{ $t('login.login') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'Login',
  props: {
    msg: String
  },
  data: () => {
    return {
      showPassword: false,
      userName: null,
      password: null,
      snacs: []
    }
  },
  methods: {
    ...mapActions({
      dologin: 'sso/user/login',
    }),
    ...mapMutations({
      alert: 'snacks/showMessage'
    }),
    login () {
      const self = this
      self
        .dologin({
          userName: self.userName,
          password: self.password,
          axios: self.$axios
        })
        .then(
          function (data) {
            if (data >= 200 && data < 300) {
              self.$router.push({ path: '/watchlist/' })
              self.alert({
                color: 'success',
                content: 'login.successful'
              })
            } else {
              self.alert({
                color: 'error',
                content: 'login.failed'
              })
            }
          },
          function (data) {}
        )
    }
  }
}
</script>
