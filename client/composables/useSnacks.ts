import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { Snack, SnackState } from "@/types/stores";

export const useSnacks = defineStore("snacks", () => {
  const state = ref<SnackState>({
    Snacks: reactive([]),
  });
  function showMessage(snack: Snack) {
    state.value.Snacks.splice(0, 0, snack);
    hideMessage(snack);
  }
  function hideMessage(snack: Snack) {
    setTimeout(() => {
      close(snack);
    }, snack.timeout ?? 1000);
  }
  function close(snack: Snack) {
    if (state.value.Snacks.indexOf(snack) > -1)
      state.value.Snacks.splice(state.value.Snacks.indexOf(snack), 1);
  }

  return {
    state,
    showMessage,
    close,
  };
});
