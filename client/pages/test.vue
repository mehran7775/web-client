<template>
     <!-- <div v-ada-drop-zone @uploaded_files="receive_files_uploaded">
          <div class="tw-w-1/2 tw-h-72 tw-bg-gray tw-m-auto tw-text-center tw-pt-10">
               drag and drop files
          </div>
          <div v-if="files.length > 0">
               <div v-for="file in files" :key="file.id" class="tw-flex">
                    <img class="tw-w-16 tw-h-16 tw-mx-3 rounded" :src="file.url" :alt="file.id">

                    <div>
                         id: {{ file.id }} <br>
                         url: {{ file.url }} <br>
                         size: {{ file.file.size }}
                    </div>

               </div>
               <div>
                    <ada-btn color="primary" @click="send_files()" width="50px" height="30px" class="tw-m-4">
                         {{ $t("general.send") }}
                    </ada-btn>
               </div>

          </div>
     </div> -->
     <div>
          <ada-radio-buttom :items="[{ label: 'من', value: 1 }, { label: 'تو', value: 2 }]" :size="24" class="tw-flex tw-font-bold"></ada-radio-buttom>
     </div>
</template>

<script setup lang="ts">
import { ref } from '#app';
import UploadableFile from '~~/types/upload/UploadableFile';
import UploadFileService from '~~/repositories/uploadFiles/index'
import adaRadioButtom from '@/components/ada-radioButton.vue'

const files = ref<UploadableFile[]>([])

function receive_files_uploaded(e: any) {
     files.value = e.detail.value
}
function send_files() {
     files.value.forEach((file, index) => {
          upload(index, file.file)
     })
}
async function upload(index: number, file: File) {
     UploadFileService.upload(file)
          .then((response) => {
               console.log(response)
          }).catch((e) => {
               console.log(e)
          })
}
</script>
