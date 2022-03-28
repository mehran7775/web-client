<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number;
  };
}>();
const pageNotFound = "404 Not Found";
const otherError = "An error occurred";
</script>

<template>
  <v-app>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/"> Home page </NuxtLink>
  </v-app>
</template>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
