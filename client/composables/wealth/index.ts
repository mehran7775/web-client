import { defineStore } from "pinia";
import { UserState } from "@/types/stores";
import { Wealth, WealthSearchModel } from "@/types";
import { useInstrument, useAxios, useUser } from "..";
import { doAsync } from "@/utils";
import wealthManager from "@/repositories/wealth/wealth_manager";

export * from "./order";

export const useWealth = defineStore("wealth", () => {
  const userState = useUser();
  const axios = useAxios();
  const instrumentManager = useInstrument();

  async function getWealth(
    payload: WealthSearchModel
  ): Promise<Array<Wealth> | undefined> {
    if (userState.state.userName) {
      const wealth = (
        await wealthManager.getWealth(
          userState.state.userName,
          payload,
          axios.createInstance()
        )
      ).data?.data;
      doAsync(() =>
        wealth.every((item) => instrumentManager.updateInstrument(item))
      );
      return wealth;
    } else return [];
  }

  return {
    getWealth,
  };
});
