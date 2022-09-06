<template>
  <div class="tw-relative tw-w-10 tw-h-10 tw-overflow-hidden tw-bg-primary tw-bg-opacity-10 tw-rounded-full">
    <ada-icon v-if="img" class="tw-m-0 tw-p-0 tw-text-primary" slot="placeholder" :size="20"> isax-frame-bold
    </ada-icon>
    <img v-else :src="img" alt="پروفایل کاربر" class="tw-bg-contain tw-w-full tw-h-full">
  </div>
</template>
<script lang="ts">
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
