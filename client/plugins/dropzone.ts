import { Plugin } from "@nuxt/types";
import Vue, { DirectiveOptions } from "vue";

const DropZoneDirective: DirectiveOptions = {
  bind(el, binding, vnode) {
    el.addEventListener("drop", (ev) => {
      console.log(ev);
    });
  },
  unbind(el) {},
};

export default <Plugin>function () {
  Vue.directive("ada-drop-zone", DropZoneDirective);
};
