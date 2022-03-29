import { defineStore } from "pinia";
import {
  InstrumentCache,
  InstrumentSearchModel,
  Order,
  OrderSearchModel,
  PaginatedResult,
  Wealth,
} from "~/types";
import { useInstrument, useAxios, useWealth, useUser } from "..";
import orderManager from "@/repositories/wealth/order_manager";

export const useOrder = defineStore("order", () => {
  const userState = useUser()
  const axios = useAxios();
  const instrumentManager = useInstrument();
  const wealthManager = useWealth();

  async function getOrders(
    payload: OrderSearchModel
  ): Promise<PaginatedResult<Order> | undefined> {
    if (userState.state.userName) {
      const orders = (
        await orderManager.getOrders(userState.state.userName, payload, axios.createInstance())
      ).data as PaginatedResult<Order>;

      const pi = instrumentManager.getInstrumentsDetail(
        new InstrumentSearchModel(orders.data.map((ord) => ord.instrumentId))
      );
      const pw = wealthManager.getWealth({ offset: 0, length: 1, echo: null });

      const instruments = (await pi) as Array<InstrumentCache>;
      const wealth = (await pw) as Array<Wealth>;
      orders.data = orders.data.map((ord) => {
        return Object.assign(
          {},
          instruments.find((i) => i.id == ord.instrumentId),
          { wealth: wealth.find((w) => w.id == ord.instrumentId)?.amount ?? 0 },
          ord
        );
      });
      return orders;
    }
  }
});
