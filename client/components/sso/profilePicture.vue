<template>

<div class="tw-relative tw-w-10 tw-h-10 tw-overflow-hidden tw-bg-primary-100 tw-rounded-full">
    <ada-icon v-if="img" class="tw-m-0 tw-p-0 tw-text-primary" slot="placeholder" :size="20"> isax-frame-bold </ada-icon>
    <img v-else :src="img" alt="پروفایل کاربر" class="tw-bg-contain tw-w-full tw-h-full">
</div>  
  <!-- <div class="avatar">
    {{img}}
    <div class="profile">
      <img width="20" height="20" :src="img" alt="پروفایل کاربر" class="tw-bg-contain">
    </div>
  </div> -->
  <!-- <v-avatar class="tw-m-0 tw-p-tw-bg-red-300 tw-border tw-rounded-full tw-border-gray tw-shadow-md" size="32"> -->
    <!-- <v-img class="tw-m-0 tw-p-0 tw-bg-contain " :src="img " max-width="32" width="24" aspect-ratio="2">
      <ada-icon class="tw-m-0 tw-p-0 tw-text-primary" slot="placeholder" :size="24"> isax-frame-bold </ada-icon>
    </v-img> -->
    
  <!-- </v-avatar> -->
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
