<template>
  <v-avatar size="32" rounded>
    <v-img :src="img" max-width="32">
      <v-icon slot="placeholder"> mdi-account </v-icon>
    </v-img>
  </v-avatar>
</template>
<script lang="ts">
import { defineComponent, ref, useStore } from "@nuxtjs/composition-api";
//TODO Handle profile image and it's place holder here
export default defineComponent({
  name: "profile-picture",
  props: ["address"],
  setup(props, context) {
    const store = useStore();
    const img = ref("");
    if (props.address) {
      store
        .dispatch("user/getProfilePic", props.address)
        .then((res) => {
          img.value = res;
        })
        .catch();
    }
    return {
      img,
    };
  },
});
</script>
