<script setup lang="ts">
import { ref, Ref } from "#app";
import profilePic from "@/components/sso/profilePictureEditor.vue";
import logs from "@/components/sso/userLog.vue";
import profileViewer from "@/components/sso/profileViewer.vue";
import { useUser } from "~/composables";

const userManager = useUser();
const currentUser = userManager.me;
const pic: Ref<File | null> = ref(null);
function profile(a: any) {
  //TODO
}
defineExpose({ currentUser, pic, profile });
</script>

<template>
  <div class="2xl:tw-container">
    <div class="tw-grid tw-grid-cols-2">
      <profile-pic :address="currentUser.profile && currentUser.profile.profilePic" :size="184" v-model="pic"
        @input="(a) => profile(a)" />
      <profileViewer v-model="currentUser.profile" />
    </div>
    <div class="tw-grid tw-grid-cols-1">
      <logs />
    </div>
  </div>
</template>
