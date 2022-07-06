import { defineStore } from "pinia";
import { ref, computed, reactive } from "#app";
import {
  Notification,
  InstrumentCache,
  MessageQuery,
  MessageFilter,
} from "@/types";
import { NotificationState } from "@/types/stores";
import { useMessages } from "@/composables";

export const useNotifications = defineStore("notifications", () => {
  const state = ref<NotificationState>({
    cache: new Map<string, Array<Notification>>(),
  });

  //TODO Replace
  const msg = useMessages();

  async function getInstrumentNotifications(
    inst: InstrumentCache
  ): Promise<Array<Notification>> {
    const res: Array<Notification> = [];
    const qry = new MessageQuery(0, 1, new MessageFilter([]));
    qry.filters.title = "(" + inst.name;
    const { data } = await msg.getMessages(qry);
    if (data.length > 0) {
      res.push({
        type: "Administrative",
        params: [],
      });
    }
    return res;
  }

  return {
    state,
    getInstrumentNotifications,
  };
});
