<template>
  <v-img src="/logo.png" max-width="24" />
</template>
<script lang="ts">
import { defineComponent } from "@vue/composition-api";
//TODO Handle profile image and it's place holder here
export default defineComponent({
  name: "profile-picture",
  props: ["username"],
  setup() {},
});
</script>
