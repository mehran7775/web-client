import { ref } from 'vue'
import UploadableFile from '~~/types/upload/UploadableFile'
import FileTypes from '~~/types/imageTypes'

export function useUploadAbleFile() {
    const files = ref<UploadableFile[]>([])
    
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


    function validateType(type: FileTypes) {
        const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/webp', 'text/plain', 'application/json']
        return acceptedFileTypes.includes(type)
    }

    function readerTextFile (file: File, callback: (evt: any) => void) {
        let readerFile = new FileReader()
        readerFile.readAsText(file)
        readerFile.onloadend = callback
    }


    return { files, addFiles, readerTextFile }
}

