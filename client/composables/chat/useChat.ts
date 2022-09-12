import { defineStore } from "pinia";
import { MessageChat } from "~~/types";
import { reactive } from 'vue'


export const useChat = defineStore("chat", ()=> {
    const state = reactive({
        messages: [] as MessageChat[]
    })

    ////getters


    ////actions

    function send(message: string):void {

    }

    function remove(message:MessageChat):void {

    }

    function edit(message:MessageChat):void {

    }



    return {
        state,
        send,
        remove,
        edit
    }
})