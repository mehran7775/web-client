<template>
  <v-avatar size="32">
    <v-img v-if="address" :src="address" max-width="32" />
    <v-icon v-else> mdi-account </v-icon>
  </v-avatar>
</template>
<script lang="ts">
import { defineComponent } from "@vue/composition-api";
//TODO Handle profile image and it's place holder here
export default defineComponent({
  name: "profile-picture",
  props: ["address"],
  setup(props, context) {},
});
</script>
