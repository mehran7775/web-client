import { defineStore } from "pinia";
import { ref, computed } from "#app";
import { useAxios } from "@/composables/useAxios";
import { getMethods } from "@/repositories/accounting/payment";
import { PaymentMethod } from "~~/types";

export const usePayment = defineStore("payment", () => {
  const paymentMethodsCache = ref<Array<PaymentMethod>>([]);
  const axios = useAxios().createInstance();

  const paymentMethods = computed(() => {
    if (paymentMethodsCache.value.length == 0) {
      getMethods(axios).then((res) => {
        paymentMethodsCache.value = res.data.data;
      });
    }
    return paymentMethodsCache.value;
  });

  return {
    paymentMethods,
  };
});
