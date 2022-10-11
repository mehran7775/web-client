import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { Snack, SnackState } from "@/types/stores";

export const useSnacks = defineStore("snacks", () => {
  // const state = ref<SnackState>({
  //   Snacks: reactive([]),
  // });

  const state = reactive<{
    Snacks: Array<Snack>
  }>({
    Snacks: []
  })


  const snacks = computed(()=> state.Snacks)


  function showMessage(snack: Snack) {
    state.Snacks.splice(0, 0, snack);
    hideMessage(snack);
  }
  function hideMessage(snack: Snack) {
    setTimeout(() => {
      close(snack);
    }, snack.timeout ?? 1000);
  }
  function close(snack: Snack) {
    if (state.Snacks.indexOf(snack) > -1)
      state.Snacks.splice(state.Snacks.indexOf(snack), 1);
  }

  return {
    state,
    snacks,
    showMessage,
    close,
  };
});
