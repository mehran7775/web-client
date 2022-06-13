<template>
     <div v-ada-drop-zone @uploaded_files="receive_files_uploaded">
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
     </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity';
import UploadableFile from '~~/types/UploadableFile'
import uploadedFile from '@/repositories/uploadFile/index'

let files = ref<UploadableFile[]>([])

function receive_files_uploaded(e: any) {
     files.value = e.detail.value
}

function send_files() {
     let form = new FormData()
     files.value.forEach((file, index) => {
          form.append(`files[${index}]`, file.file)
     })
     try {
          const res = uploadedFile.send_files('/f', form, {
               headers: {
                    'content-type': 'multipart/form-data'
               }
          })
          console.log(res)
     } catch (e) {
          console.log(e)
     }

}

</script>
