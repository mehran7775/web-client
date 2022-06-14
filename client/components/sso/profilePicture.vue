<template>
  <v-avatar class="tw-m-0 tw-p-0 tw-bg-red-300 tw-border tw-rounded-full tw-border-gray tw-shadow-md" size="32">
    <v-img class="tw-m-0 tw-p-0 tw-bg-contain " :src="img " max-width="32" width="24" aspect-ratio="2">
      <ada-icon class="tw-m-0 tw-p-0" slot="placeholder" :size="24"> mdi-account </ada-icon>
    </v-img>
  </v-avatar>
</template>
<script lang="ts">
import { defineComponent, ref } from "#app";
import { useUser } from "~/composables";

export default defineComponent({
  name: "profile-picture",
  props: ["address"],
  setup(props) {
    const userManager = useUser();
    const img = ref("");
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
    };
  },
});
</script>
