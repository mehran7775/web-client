<script lang="ts" setup>
import UploadableFile from "~/types/upload/UploadableFile";
import { useUploadAbleFile } from "~~/composables";

const uploadFile = useUploadAbleFile();
const files = ref<UploadableFile[]>([]);

const content = ref(null);
function receive_files_uploaded(e: any) {
  files.value = e.detail.value;
  const { readerTextFile, contentFile } = uploadFile;
  if (
    files.value[0].file.type.indexOf("text") == 0 ||
    files.value[0].file.type === "application/json"
  ) {
    readerTextFile(files.value[0].file);
    content.value = contentFile;
  }
}

function removeFile(file: UploadableFile): void {
  const index = files.value.indexOf(file);
  if (index > -1) files.value.splice(index, 1);
}
</script>

<style lang="postcss" scoped>
#uploader {
  @apply tw-w-1/2 tw-bg-info tw-bg-opacity-5 tw-border tw-border-dashed tw-border-info tw-rounded-lg tw-mx-auto;

  .uploader {
    @apply tw-flex tw-px-10 tw-py-5 tw-cursor-pointer;

    .icon {
      @apply tw-text-info tw-text-opacity-70;
    }
    &__title {
      &--info {
        @apply tw-text-info;
      }
    }
    &__description {
      @apply tw-flex tw-flex-col tw-mr-5;

      &--gray {
        @apply tw-text-gray-400;
      }
    }

    &__file {
      @apply tw-relative tw-rounded tw-border tw-border-info tw-border-opacity-70 tw-flex tw-flex-col tw-items-center tw-p-2 tw-mx-1;
      &__close {
        @apply tw-absolute tw-left-1 tw-top-1 tw-w-7 tw-h-7 tw-bg-info tw-bg-opacity-10 hover:tw-bg-info;
        line-height: 1;
        &:hover {
          .icon {
            @apply tw-text-white;
          }
        }
      }
      &__name {
        max-width: 96px;
        min-width: 96px;
        @apply tw-overflow-clip tw-text-ellipsis tw-whitespace-nowrap tw-text-center;
      }
    }
  }
}
</style>

<template>
  <NuxtLayout name="test">
    <div id="uploader" v-ada-drop-zone @uploaded_files="receive_files_uploaded">
      <div class="uploader">
        <TransitionGroup name="slide-fade">
          <template v-if="!files.length">
            <ada-icon class="uploader__icon--info" size="3.25rem"
              >isax-document-upload-outline</ada-icon
            >
            <div class="uploader__description">
              <h5
                v-text="$t('accounting.upload')"
                class="uploader__title--info"
              ></h5>
              <p
                v-text="$t('accounting.desUpload')"
                class="uploader__description--gray"
              ></p>
            </div>
          </template>
          <template v-else>
            <div class="uploader__file" v-for="file in files" :key="file.id">
              <ada-btn
                class="uploader__file__close"
                @click.stop="removeFile(file)"
              >
                <ada-icon size="1rem">mdi-close</ada-icon>
              </ada-btn>
              <ada-icon size="3rem" class="uploader__file__icon"
                >mdi-file-document</ada-icon
              >
              <span class="uploader__file__name" v-text="file.file.name"></span>
            </div>
          </template>
        </TransitionGroup>
      </div>
    </div>
  </NuxtLayout>
</template>
