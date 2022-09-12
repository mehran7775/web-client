<script lang="ts" setup>
import UploadableFile from "~/types/upload/UploadableFile";

const files = ref<UploadableFile[]>([]);

function receive_files_uploaded(e: any) {
  files.value = e.detail.value;
}


</script>

<style lang="postcss" scoped></style>

<template>
  <div class="tw-relative tw-z-30 tw-h-screen tw-bg-primary">
    <div class="tw-w-14 tw-h-16 tw-bg-white" v-ada-drop-zone
      @uploaded_files="receive_files_uploaded"
    >
      dropzone
    </div>

    {{files}}
  </div>
</template>
