<script setup lang="ts">
import { useUser } from "~/composables";

const props = defineProps<{
  address: string | null;
  size: number;
}>();

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
defineExpose({
  img,
  pic,
});
</script>

<style lang="postcss" scoped>
.file {
  position: absolute;
  bottom: 1px;
  width: 100%;
}
</style>

<template>
  <div :size="size" rounded>
    <v-img :src="img" :max-width="size">
      <ada-icon :size="size" slot="placeholder"> mdi-account </ada-icon>
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
  </div>
</template>
