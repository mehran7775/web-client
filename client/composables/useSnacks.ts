import { defineStore } from "pinia";
import { ref } from "@vue/composition-api";
import { Snack } from "@/types/stores";

export const useSnacks = defineStore("snacks", () => {
  const state = ref<Snack>({ color: "", content: "" });
  function showMessage(payload: Snack) {
    state.value.content = payload.content;
    state.value.color = payload.color;
  }
  return {
    state,
    showMessage,
  };
});
