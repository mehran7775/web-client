<template>
  <v-avatar class="ma-0 pa-0" size="32" rounded>
    <v-img class="ma-0 pa-0" :src="img" max-width="32">
      <v-icon class="ma-0 pa-0" slot="placeholder"> mdi-account </v-icon>
    </v-img>
  </v-avatar>
</template>
<script lang="ts">
import { defineComponent, ref, useStore } from "@nuxtjs/composition-api";
export default defineComponent({
  name: "profile-picture",
  props: ["address"],
  setup(props, context) {
    const store = useStore();
    const img = ref("");
    if (props.address) {
      store
        .dispatch("sso/user/getProfilePic", props.address)
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
