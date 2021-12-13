<template>
  <v-avatar :size="size" rounded>
    <v-img :src="img" :max-width="size">
      <v-icon :size="size" slot="placeholder"> mdi-account </v-icon>
    </v-img>
    <v-file-input
      accept="image/*"
      prepend-icon=""
      prepend-inner-icon="mdi-camera"
      class="file"
      color="transparent"
      v-model="pic"
      @change="(a) => $emit('input', pic)"
      hide-details
      dense
    >
    </v-file-input>
  </v-avatar>
</template>
<script lang="ts">
import { defineComponent, ref, useStore } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "profile-picture",
  props: {
    address: String,
    size: Number,
  },
  setup(props, context) {
    const store = useStore();
    const img = ref("");
    const pic = ref(null);
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
      pic,
    };
  },
});
</script>

<style lang="sass" scoped>
.file
  position: absolute
  bottom: 1px
  width: 100%
</style>
