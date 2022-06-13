interface UploadFile {
    file: File
    id: string
    url: string
    status: null
}

class UploadableFile implements UploadFile{
    file: File
    id: string
    url: string
    status: null
    constructor(file: File) {
        this.file = file
        this.id = `${file.name}-${file.size}-${file.lastModified}-${file.type}`
        this.url = URL.createObjectURL(file)
        this.status = null
    }
}
export default UploadableFile