<script lang="ts" setup>
import UploadableFile from "~/types/upload/UploadableFile";
import UploadFileService from "~/repositories/uploadFiles/index";
const active = ref(false);

const files = ref<UploadableFile[]>([]);

function receive_files_uploaded(e: any) {
  // files.value = e.detail.value;
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

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

const allowDrop = (e)=> {
  e.preventDefault()
}
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
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
    <img id="drag1" src="/logo.png" draggable="true"  @dragstart="drag"/>
    <div id="div1" class="tw-w-20 tw-h-20 tw-bg-white tw-mx-auto tw-mt-4" draggable dropzone
      @drop="drop" @dragover="allowDrop"
    >
      dropzone
    </div>
  </div>
</template>
