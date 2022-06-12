<template>
     <div v-ada-drop-zone>
       <div class="tw-w-1/2 tw-h-72 tw-bg-gray tw-m-auto tw-text-center tw-pt-10">
            drag and drop files
       </div>
       <div>{{files}}</div>
    </div>  
</template>

<script setup lang="ts">
import uploadAbleFile from "~~/composables/upload-able-file";
import { watch } from '#app'

const { files } = uploadAbleFile()



</script>
