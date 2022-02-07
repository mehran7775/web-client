<template>
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
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  ref,
  useRouter,
  useStore,
} from "@nuxtjs/composition-api";
import ProfilePicture from "@/components/sso/profilePicture.vue";
import { MenuItem, User } from "~/types";
import { useUser } from "~/composables";

export default defineComponent({
  components: {
    ProfilePicture,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const userManager = useUser(store);
    const userMenu = ref(false);
    const currentUser = userManager.me;
    const userMenuItems: Array<MenuItem> = [
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
    function doLogout() {
      userMenu.value = false;
      userManager.doLogout();
      router.push("/login");
    }
    return {
      currentUser,
      userMenu,
      userMenuItems,
    };
  },
});
</script>
