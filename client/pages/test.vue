<script lang="ts" setup>
import UploadableFile from "~/types/upload/UploadableFile";
import UploadFileService from "~/repositories/uploadFiles/index";
const active = ref(false);

const files = ref<UploadableFile[]>([]);

function receive_files_uploaded(e: any) {
  files.value = e.detail.value;
  console.log(e)
}
function send_files() {
  files.value.forEach((file, index) => {
    upload(index, file.file);
  });
}
async function upload(index: number, file: File) {
  UploadFileService.upload(file)
    .then((response) => {
      console.log(response);
    })
    .catch((e) => {
      console.log(e);
    });
}


</script>

<style lang="postcss" scoped></style>

<template>
  <div class="tw-relative tw-z-30 tw-h-screen tw-bg-primary">
    <!-- <div
      v-ada-drop-zone
      @uploaded_files="receive_files_uploaded"
      class="tw-w-20 tw-h-20 tw-bg-white tw-mx-auto"
    >
      dropzone
    </div> -->
    <div class="tw-w-14 tw-h-16 tw-bg-white" v-ada-drop-zone draggable
      @uploaded_files="receive_files_uploaded"
    >
      dropzone
    </div>

    {{files}}
  </div>
</template>
