import { Plugin } from "@nuxt/types";
import Vue, { DirectiveOptions } from "vue";



const DropZoneDirective: DirectiveOptions = {
  bind(el, binding, vnode) {

  },
  unbind(el) {},
};

export default <Plugin>function () {
  Vue.directive("ada-drop-zone", DropZoneDirective);
};
