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
import { defineComponent, ref } from "@vue/composition-api";
import { useUser } from "~/composables";

export default defineComponent({
  name: "profile-picture",
  props: {
    address: String,
    size: Number,
  },
  setup(props) {
    const userManager = useUser();
    const img = ref("");
    const pic = ref(null);
    if (props.address) {
      userManager
        .getProfilePic(props.address)
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

<style lang="postcss" scoped>
.file {
  position: absolute;
  bottom: 1px;
  width: 100%;
}
</style>
