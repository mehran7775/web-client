import { defineStore } from "pinia";
import { ref } from "#app";
import { Menu } from "@/types/stores";

export const useMenu = defineStore("menu", () => {
    const state = ref<Menu>({
        active: false,
        left: 'auto',
        top: 'auto',
        content: null
    });

    const showMenu = (left: string, top: string, content: any)=> {
        state.value.left = left
        state.value.top = top
        state.value.content = content
        state.value.active = true
    }

    const hideMenu = ()=> {
        state.value.active = false
        state.value.top = 'auto'
        state.value.left = 'auto'
        state.value.content = null
    }
    

    return {
        state,
        showMenu,
        hideMenu
    };
});
