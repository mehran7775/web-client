import { Plugin } from "@nuxt/types";
import Vue, { DirectiveOptions,  VNodeDirective, VNode} from "vue";
import uploadAbleFile from "~~/composables/upload/upload-able-file";

const DropZoneDirective: DirectiveOptions = {
  bind(el: HTMLElement, binding: VNodeDirective, vnode: VNode) {
    el.ondragover = onDragOver
    el.ondragstart = onDragStart
    el.ondragleave = onDragLeave
    el.ondrop = (e) => onDrop(e, el, binding, vnode)
  },
  unbind(el: HTMLElement, binding: VNodeDirective, vnode: VNode) {
    el.removeEventListener('dragover', onDragOver)
    el.removeEventListener('dragstart', onDragStart)
    el.removeEventListener('dragleave', onDragLeave)
    el.removeEventListener("drop", (e) => onDrop(e, el, binding, vnode))
  },
  // update(el,)
};


const onDragOver = (e: DragEvent) => {
  e.preventDefault()
}
const onDragStart = (e: DragEvent) => {
  e.preventDefault();
}
const onDragLeave = (e: DragEvent) => {
  e.preventDefault()
}

const onDrop = (e: DragEvent, el: HTMLElement, binding: VNodeDirective, vnode: VNode) => {
  e.preventDefault()
  const { addFiles, files } = uploadAbleFile()
  addFiles(e.dataTransfer?.files)
  if (vnode.componentInstance) {
    vnode.componentInstance.$emit('uploaded_files', { detail: files })
  } else {
    el.dispatchEvent(new CustomEvent('uploaded_files', { detail: files }));
  }
  
}

export default <Plugin>function () {
  Vue.directive("ada-drop-zone", DropZoneDirective);
};
