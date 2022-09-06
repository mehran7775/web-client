<script setup lang="ts">
////////////////

const props = withDefaults(
  defineProps<{
    path: string;
    timeInterval?: number;
  }>(),
  {
    timeInterval: 4000,
  }
);

////////////////////

const path = useAsrTrader().locale.split("-")[0] + props.path;
const contents = await queryContent(path).find();

const toggleContent = ref<string>(contents[0]._path);

const carousel = (): void => {
  setInterval(triggerCarousel, props.timeInterval);
};

const triggerCarousel = (): void => {
  const array: string[] = toggleContent.value.split("/");
  const activeSlide: number = parseInt(array[array.length - 1].split("-")[1]);
  if (activeSlide < contents.length) {
    const next = activeSlide + 1;
    toggleContent.value = toggleContent.value.replace(
      activeSlide.toString(),
      next.toString()
    );
  } else {
    toggleContent.value = toggleContent.value.replace(
      activeSlide.toString(),
      "1"
    );
  }
};

////////////////////

onMounted(() => {
  carousel();
});
</script>

<style scoped lang="postcss"></style>

<template>
  <div id="content-slider">
    <slot name="prepend"></slot>
    <div>
      <ada-tabs v-model="toggleContent">
        <ada-tab
          v-for="content in contents"
          :key="content._path"
          :model="content._path"
        >
          <ContentDoc :path="content._path" class="doc" />
        </ada-tab>
      </ada-tabs>
      <ada-toggle v-model="toggleContent">
        <ada-btn v-for="content in contents" :model="content._path">
          <div
            :class="{ active: toggleContent === content._path }"
            class="item"
          ></div>
        </ada-btn>
      </ada-toggle>
    </div>
    <slot name="append"></slot>
  </div>
</template>
