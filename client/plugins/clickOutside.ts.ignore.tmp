import { Plugin } from "@nuxt/types";
import Vue, { DirectiveOptions } from "vue";

interface clickableElement extends HTMLElement {
  __adaClickOutsideHandler__: (e: Event) => void;
}

const ClickOutsideDirective: DirectiveOptions = {
  bind(el, binding, vnode) {
    (el as clickableElement).__adaClickOutsideHandler__ = (event: Event) => {
      if (el !== event.target && !el.contains(event.target as Node | null)) {
        binding.value(event);
      }
    };
    document.body.addEventListener(
      "click",
      (el as clickableElement).__adaClickOutsideHandler__
    );
  },
  unbind(el) {
    document.body.removeEventListener(
      "click",
      (el as clickableElement).__adaClickOutsideHandler__
    );
  },
};

export default <Plugin>function () {
  Vue.directive("ada-click-outside", ClickOutsideDirective);
};
