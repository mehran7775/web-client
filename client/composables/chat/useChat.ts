import { defineStore } from "pinia";
import { MessageChat, MessageChatType } from "~~/types";
import { reactive } from 'vue'


export const useChat = defineStore("chat", ()=> {
    const state = reactive({
        messages: [] as MessageChatType[]
    })

    ////getters


    ////actions

    function pusher(message: string):void {
        const id = Math.floor(Math.random() * (50000 - 100) + 100)
        const res = new MessageChat(id, message, '1401/06/22')
        state.messages.push(res)
    }

    function remove(message:MessageChat):void {

    }

    function edit(message:MessageChat):void {

    }



    return {
        state,
        pusher,
        remove,
        edit
    }
})