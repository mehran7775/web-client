import { defineStore } from "pinia";
import { Ref, ref, computed, reactive } from "vue";
import {
  Notification,
  InstrumentCache,
  MessageQuery,
  MessageFilter,
  MessageOrigin,
} from "@/types";
import { NotificationState } from "@/types/stores";
import { getMessageSource } from "@/repositories/oms/message_manager";
import { useAxios, useInstrument } from "..";


export const useNotifications = defineStore("notifications", () => {
  const state = ref<NotificationState>({
    cache: reactive({}),
  });

  const axios = useAxios().createInstance();
  const instManager = useInstrument();

  async function initNotifications(inst: Array<string>): Promise<any> {
    //InitCache

    //Get message sources
    const { data } = await getMessageSource(inst, axios);
    const groupData = data.data.reduce((r, i, arr) => {
      r[i.instrumentCode] = r[i.instrumentCode] || [];
      r[i.instrumentCode].push({
        origin: i.origin,
        messagesCount: i.messagesCount,
      });
      return r;
    }, {} as { [key: string]: Array<{ origin: MessageOrigin; messagesCount: number }> });
    for (var d in groupData) {
      const dm: Array<Notification> = groupData[d].map((i) => ({
        type: "Administrative",
        params: {
          origin: i.origin,
          messagesCount: i.messagesCount
        }
      }));
      state.value.cache[d] = dm;
    }
    return state.value.cache;
  }

  return {
    state,
    initNotifications,
  };
});
