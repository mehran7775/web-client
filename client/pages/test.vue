<script lang="ts" setup>
import UploadableFile from "~/types/upload/UploadableFile";

const files = ref<UploadableFile[]>([]);

function receive_files_uploaded(e: any) {
  files.value = e.detail.value;
}
</script>

<style lang="postcss" scoped></style>

<template>
  <div class="tw-h-screen tw-bg-primary">
    <!-- <div class="tw-w-14 tw-h-16 tw-bg-white" v-ada-drop-zone
      @uploaded_files="receive_files_uploaded"
    >
      dropzone
    </div>

    {{files}} -->
    <div class="tw-mx-auto tw-w-52 tw-bg-error tw-p-16 tw-text-center">
      <ada-tooltip position="under" class="tw-bg-primary">
        <template #activator>
          <ada-btn :model="null">
            <ada-icon size="3rem"> isax-home-2 </ada-icon>
          </ada-btn>
        </template>
        <span>duifgysdioufh</span>
      </ada-tooltip>
    </div>
  </div>
</template>
