<template>
    <NuxtLayout name="test">
      <template #main>
        <ada-tabs  class="tw-h-[200px]">
          <ada-tab v-for="item in tabs.items" :key="item.name" :name="item.path" :to="item.path"> {{ item.name }}</ada-tab>
        </ada-tabs>
        <button @click="$router.push('/test/mehran')">click</button>
        <NuxtChild></NuxtChild>
      </template>
      <template #footer>
       
      </template>
    </NuxtLayout>
  </template>
  
  <script setup lang="ts">
  
  
  const tabs = reactive<{
    items: Array<{ name: string, path: string }>
  }>({
    items: [
      {
        name: "mehran",
        path: "/mehran",
      },
      {
        name: "hosein",
        path: "/hosein",
      },
      {
        name: "jafar",
        path: "/jafar",
      },
    ],
  });
  
  </script>
  
  
  <style scoped lang="postcss">
  .tab--active {
      @apply tw-bg-primary/20;
  }
  
  </style>
  