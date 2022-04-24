import { Plugin } from "@nuxt/types";

interface clickableElement extends Element {
  __adaClickOutsideHandler__: (e: Event) => void;
}

const ClickOutsideDirective = {
  mounted(el: clickableElement, binding: any) {
    el.__adaClickOutsideHandler__ = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node | null)))
        binding.value(event);
    };
    document.body.addEventListener("click", el.__adaClickOutsideHandler__);
  },
  unmounted(el: clickableElement) {
    document.body.removeEventListener("click", el.__adaClickOutsideHandler__);
  },
};

export default <Plugin>function ({ app }) {
  app.directive("click-outside", ClickOutsideDirective);
};
