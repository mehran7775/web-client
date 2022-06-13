import { ref } from '#app'
import UploadableFile from '~~/types/UploadableFile'
import imageTypes from '~~/types/imageTypes'

export default function () {
    let files = ref<UploadableFile[]>([])
    function addFiles(newFiles: File[]): void {
        let newUploadableFiles = [...newFiles]
            .filter(( file ) => validateType(file.type))
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

    function validateType(type: imageTypes) {
        const acceptedImageTypes = ['image/png', 'image/jpeg', 'image/webp']
        return acceptedImageTypes.includes(type)
    }

    return { files, addFiles, removeFile }
}

