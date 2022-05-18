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
  <v-container fluid>
    <v-row>
      <v-col>
        <profile-pic
          :address="currentUser.profile && currentUser.profile.profilePic"
          :size="184"
          v-model="pic"
          @input="(a) => profile(a)"
        />
      </v-col>
      <v-col>
        <profileViewer v-model="currentUser.profile" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <logs />
      </v-col>
    </v-row>
  </v-container>
</template>
