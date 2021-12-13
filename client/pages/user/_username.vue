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
        <profile v-model="currentUser.profile" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <logs />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { User } from "@/types";
import {
  defineComponent,
  ref,
  Ref,
  computed,
  ComputedRef,
  useStore,
} from "@nuxtjs/composition-api";
import profilePic from "@/components/sso/profilePictureEditor.vue";
import logs from "@/components/sso/userLog.vue";
import profile from "@/components/sso/profileViewer.vue";

export default defineComponent({
  components: {
    profilePic,
    logs,
    profile,
  },
  setup() {
    const store = useStore();
    const currentUser: ComputedRef<User> = computed(
      () => store.getters["sso/user/me"] as User
    );
    const pic: Ref<File | null> = ref(null);
    function profile(a: any) {
      console.log("log: ", a);
    }
    return { currentUser, pic, profile };
  },
});
</script>
