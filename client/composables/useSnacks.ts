import { defineStore } from "pinia";
import { ref } from "#app";
import { Snack } from "@/types/stores";

export const useSnacks = defineStore("snacks", () => {
  const state = ref<Snack>({ 
    color: "",
    content: "",
    show: false ,
    timeout: 0,
    bg: 'tw-bg-primary'
  });
  function showMessage(payload: Snack) {
    state.value.content = payload.content;
    state.value.color = payload.color;
    payload.bg ? state.value.bg = payload.bg : null
    payload.timeout ? state.value.timeout = payload.timeout : null
    hideMessage(state.value.timeout)
  }
  function hideMessage(time: number | undefined) {
    if (time){
      setTimeout(()=> {
        state.value.timeout = 0
      }, time*1000)
    }
  }

  return {
    state,
    showMessage,
  };
});
