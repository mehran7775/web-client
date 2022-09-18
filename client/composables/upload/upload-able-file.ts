import { ref } from 'vue'
import UploadableFile from '~~/types/upload/UploadableFile'
import FileTypes from '~~/types/imageTypes'

export function useUploadAbleFile() {
    const files = ref<UploadableFile[]>([])
    const contentFile = ref<string>('')
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

    function readerTextFile (file: File) {
       
        let readerFile = new FileReader()
        readerFile.onload = (evt)=> {
            contentFile.value = evt.target.result as string
        }
        
        readerFile.readAsText(file)
        
    }


    return { files, contentFile, addFiles, readerTextFile }
}

