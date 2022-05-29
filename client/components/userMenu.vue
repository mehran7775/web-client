<script setup lang="ts">
import { ref, computed } from "#app";
import ProfilePicture from "@/components/sso/profilePicture.vue";
import { MenuItem } from "~/types";
import { useUser } from "~/composables";
import { useRouter } from "#app";
import { DateTime } from "luxon"
import AdaIcon from "./adaIcon.vue";


const router = useRouter();
const userManager = useUser();
const userMenu = ref(false);
const currentUser = computed(() => userManager.me);
const userMenuItems: Array<MenuItem> = [
  {
    icon: "mdi-account-cog",
    to: "/user/",
    title: "menu.profile",
  },
  {
    icon: "mdi-download",
    title: "menu.saveSettings",
    click: downloadSettings,
    color: 'info'
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
function downloadSettings() {
  const settings = URL.createObjectURL(new Blob([JSON.stringify(userManager.me.settings)], {
    type: 'application/json'
  }));
  const a = document.createElement('a')
  a.href = settings;
  a.download = currentUser.value.userName
    + "-settings-"
    + DateTime.now().toISO()
    + ".json";
  a.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    })
  );

}
defineExpose({
  ProfilePicture,
  currentUser,
  userMenu,
  userMenuItems,
});
</script>

<style lang="postcss" scoped>
.user-menu-activator {
  &::before {
    background-color: var(--c-primary-rgb) !important;
  }
}
</style>

<template>
  <v-menu v-model="userMenu" class="user-menu" offset-y>
    <template #activator="{ on, attrs }">
      <v-btn height="28" min-width="184px" v-bind="attrs" v-on="on"
        class="ma-0 pa-0 px-3 justify-start user-menu-activator" color="transparent" depressed>
        <profile-picture :address="currentUser.profile && currentUser.profile.profilePic" />
        <span class=".d-none .d-sm-flex">{{
            currentUser.profile.nickname
              ? currentUser.profile.nickname
              : currentUser.userName
        }}</span>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item v-for="item in userMenuItems" :key="item.title" :to="item.to" @click="
        () => {
          if (item.click) item.click();
        }
      ">
        <ada-icon :color="item.color" :size="16">{{ item.icon }}</ada-icon>
        <v-list-item-title :class="item.color + '--text'">
          {{ $t(item.title) }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

