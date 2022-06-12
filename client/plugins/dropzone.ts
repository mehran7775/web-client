import { Plugin } from "@nuxt/types";
import Vue, { DirectiveOptions } from "vue";
import uploadAbleFile from "~~/composables/upload-able-file";

const DropZoneDirective: DirectiveOptions = {
  bind(el, binding, vnode) {
    el.ondragover = onDragOver
    el.ondragstart = onDragStart
    el.ondragleave = onDragLeave
    el.ondrop = (e) => onDrop(e, binding, vnode)
  },
  unbind(el, binding, vnode) {
    el.removeEventListener('dragover', onDragOver)
    el.removeEventListener('dragstart', onDragStart)
    el.removeEventListener('dragleave', onDragLeave)
    el.removeEventListener("drop", (e) => onDrop(e, binding, vnode))
  },
  // update(el,)
};


const onDragOver = (e: any) => {
  e.preventDefault()
}
const onDragStart = (e: any) => {
  e.preventDefault();
}
const onDragLeave = (e: any) => {
  e.preventDefault()
}

const onDrop = (e: any, binding: any, vnode: any) => {
  console.log('binding', binding)
  console.log('binding', vnode)
  e.preventDefault();
  const { addFiles, files } = uploadAbleFile()
  addFiles(e.dataTransfer.files)
  console.log( vnode.ref.i.data)

  
}

export default <Plugin>function () {
  Vue.directive("ada-drop-zone", DropZoneDirective);
};
