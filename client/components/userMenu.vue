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
const me = () => {
  console.log('me')
}
</script>

<style lang="postcss" scoped>
.user-menu-activator {
  @apply tw-ml-14 tw-flex tw-justify-start tw-relative;

  &::before {
    background-color: var(--c-primary-rgb) !important;
  }
}
</style>

<template>
  <div class="userMenu" v-ada-click-outside="() => userMenu = false">
    <ada-menu id="user" :mTop="36" :mLeft="-33">
      <template #activator>
        <ada-btn :height="28" min-width="184px" class="user-menu-activator tw-py-0 tw-px-2" color="transparent"
          depressed @click.native="userMenu = !userMenu">
          <profile-picture :address="currentUser.profile && currentUser.profile.profilePic" />
          <span class="tw-mr-2 tw-font-semibold"
            v-text="currentUser.profile.nickname ? currentUser.profile.nickname : currentUser.userName"></span>
        </ada-btn>
      </template>
      <template v-if="userMenu" #items>
        <ada-list class="tw-p-0 tw-m-0">
          <ada-list-item v-for="item in userMenuItems" :key="item.title" :to="item.to" :value="item"
            class="hover:tw-bg-gray-200">
            <template #item="{ value }">
              <div class="tw-cursor-pointer" @click="() => {
                if (item.click) item.click()
              }">
                <ada-icon :color="value.color" :size="16">{{ value.icon }}</ada-icon>
                <span v-text="$t(value.title)"></span>
              </div>
            </template>
          </ada-list-item>
        </ada-list>
      </template>
    </ada-menu>
  </div>
</template>

