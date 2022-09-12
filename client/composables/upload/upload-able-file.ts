import { ref } from 'vue'
import UploadableFile from '~~/types/upload/UploadableFile'
import FileTypes from '~~/types/imageTypes'

export function uploadAbleFile() {
    let files = ref<UploadableFile[]>([])
    function addFiles(newFiles: FileList): void {
        let newUploadableFiles = [...newFiles]
            .filter(( file ) => validateType(file.type as FileTypes))
            .map((file) => new UploadableFile(file))
            .filter((file) => !fileExists(file.id))
        files.value = files.value.concat(newUploadableFiles)
        // files.value.push(newUploadableFiles)
    }

    function fileExists(otherId: string) {
        return files.value.some((file: UploadableFile) => file.id === otherId)
    }

    function removeFile(file: UploadableFile): void {
        const index = files.value.indexOf(file)

        if (index > -1) files.value.splice(index, 1)
    }

    function validateType(type: FileTypes) {
        const acceptedImageTypes = ['image/png', 'image/jpeg', 'image/webp', 'text/plain']
        return acceptedImageTypes.includes(type)
    }

    return { files, addFiles, removeFile }
}

