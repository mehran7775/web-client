interface clickableElement extends HTMLElement {
  __adaClickOutsideHandler__: (e: Event) => void;
}

export default defineNuxtPlugin(({ vueApp }) => {

  const ClickOutsideDirective = {
    created(el, binding) {
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
    unmounted(el: HTMLElement) {
      document.body.removeEventListener(
        "click",
        (el as clickableElement).__adaClickOutsideHandler__
      );
    },
  };


  vueApp.directive("ada-click-outside", ClickOutsideDirective)
})