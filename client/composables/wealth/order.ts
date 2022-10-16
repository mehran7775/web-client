import { defineStore } from "pinia";
import {
  InstrumentCache,
  InstrumentSearchModel,
  Order,
  OrderClass,
  OrderSearchModel,
  OrderType,
  PaginatedResult,
  Side,
  ValidationType,
  Wealth,
  
} from "~/types";
import { useInstrument, useAxios, useWealth, useUser } from "..";
import orderManager from "@/repositories/wealth/order_manager";
import { DateTime } from "luxon";
import { Ref, ref } from "vue";

export const useOrder = defineStore("order", () => {
  const userState = useUser();
  const axios = useAxios();
  const instrumentManager = useInstrument();
  const wealthManager = useWealth();
  const orderFormCache: { [key: string]: Ref<Order> } = {};
  const last_update: string = new Date().toISOString()

  
/////////////////

  function getForm(id: string) {
    let tmp = orderFormCache[id]; 
    if (typeof tmp == "undefined") {
      tmp = ref<Order>(new OrderClass());
      orderFormCache[id] = tmp;
    }
    return tmp.value;
  }

  function updateForm(form: any) {
    Object.assign(getForm(form.instrumentId.toString()), form);
  }

  async function getOrders(
    payload: OrderSearchModel
  ): Promise<PaginatedResult<Order> | undefined> {
    if (userState.state.userName) {
      const orders = (
        await orderManager.getOrders(
          userState.state.userName,
          payload,
          axios.createInstance()
        )
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
    return undefined;
  }

  async function placeOrder(order: Order) {
    return await orderManager.setOrder(order, axios.createInstance());
  }

  async function editOrder(order: Order) {
    await orderManager.editOrder(order, axios.createInstance());
  }


  function setSide(side: Side, id: string) {
    getForm(id);
    orderFormCache[id].value.side = side;
  }

  return {
    placeOrder,
    getOrders,
    getForm,
    updateForm,
    setSide,
    editOrder,
    last_update
  };
});
