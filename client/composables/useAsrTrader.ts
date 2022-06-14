import { ref, computed } from "#app";
import { defineStore } from "pinia";
import { RootState } from "@/types/stores";

export const useAsrTrader = defineStore("app", () => {
  const state = ref(new RootState());

  // Getters
  const locale = computed({
    get() {
      return state.value.locale;
    },
    set(locale: string) {
      setLocale(locale);
    },
  });
  const rtl = computed(() =>
    ["fa", "ar", "azIr", "ckb"].includes(state.value.locale)
  );
  const menu = computed({
    get() {
      return state.value.menu;
    },
    set(menu: string | number | null) {
      setMenu(menu);
    },
  });
  const percentFormatter = computed(() =>
    Intl.NumberFormat(state.value.locale, {
      style: "percent",
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    })
  );
  const currencyFormatter = computed(
    () =>
      (currency: string = "IRR") =>
        Intl.NumberFormat(state.value.locale, {
          style: "currency",
          currency: currency,
          minimumFractionDigits: 1,
          maximumFractionDigits: 3,
        })
  );
  const formatter = computed(() =>
    Intl.NumberFormat(state.value.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    })
  );

  // Mutations
  function setMenu(menu: string | number | null) {
    state.value.menu = menu;
  }
  function setLocale(locale: string) {
    state.value.locale = locale;
  }

  return {
    locale,
    rtl,
    menu,
    percentFormatter,
    currencyFormatter,
    formatter,
    setMenu,
    setLocale,
  };
});
