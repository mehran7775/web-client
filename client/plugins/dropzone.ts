// import { Plugin } from "@nuxt/types";
// import Vue, { DirectiveOptions,  VNodeDirective, VNode} from "vue";
import { uploadAbleFile } from "@/composables";


export default defineNuxtPlugin(({ vueApp }) => {
  const DropZoneDirective = {
    created(el, binding, vnode) {
      el.ondragover = onDragOver
      el.ondragstart = onDragStart
      el.ondragleave = onDragLeave
      el.ondrop = (e) => onDrop(e, el, binding, vnode)
    },
    onUnmounted(el, binding, vnode) {
      el.removeEventListener('dragover', onDragOver)
      el.removeEventListener('dragstart', onDragStart)
      el.removeEventListener('dragleave', onDragLeave)
      el.removeEventListener("drop", (e) => onDrop(e, el, binding, vnode))
    }
  }

  const onDragOver = (e: DragEvent) => {
    e.preventDefault()
  }
  const onDragStart = (e: DragEvent) => {
    e.preventDefault();
  }
  const onDragLeave = (e: DragEvent) => {
    e.preventDefault()
  }


  const onDrop = (e: DragEvent, el, binding, vnode) => {
    e.preventDefault()
    console.log(e.dataTransfer)
    const { addFiles, files } = uploadAbleFile()
    addFiles(e.dataTransfer?.files)
    if (vnode.componentInstance) {
      vnode.componentInstance.$emit('uploaded_files', { detail: files })
    } else {
      el.dispatchEvent(new CustomEvent('uploaded_files', { detail: files }));
    }

  }

  vueApp.directive('ada-drop-zone', DropZoneDirective)
})