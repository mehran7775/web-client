import { ref } from '#app'
import UploadableFile from '~~/types/UploadableFile'

export default function () {
    let files = ref<UploadableFile[]>([])

    function addFiles(newFiles: File[]): void {
        let newUploadableFiles = [...newFiles]
            .map((file) => new UploadableFile(file))
            .filter((file) => !fileExists(file.id))
        files.value = files.value.concat(newUploadableFiles)
        // let reader = new FileReader()
        // reader.onload = function (e) {

        // }
    }

    function fileExists(otherId: string) {
        return files.value.some(({ id }) => id === otherId)
    }

    function removeFile(file: UploadableFile): void {
        const index = files.value.indexOf(file)

        if (index > -1) files.value.splice(index, 1)
    }

    // function readmultifiles(files: []): string[] {
    //     var reader = new FileReader()
    //     let results = [] as string[] 
    //     function readFile(index: number) {
    //         if (index >= files.length) return;
    //         var file = files[index];
    //         reader.onload = function (e) {
    //             // get file content  
    //             results[index] = reader.result 
    //             // do sth with bin
    //             readFile(index + 1)
    //         }
    //         reader.readAsBinaryString(file)
    //     }
    //     readFile(0)
    //     return results
    // }

    return { files, addFiles, removeFile }
}

