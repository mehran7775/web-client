import { reactive } from "vue";
import { defineStore } from "pinia";
import { RootState } from "@/types/stores";

export const useAsrTrader = defineStore("app", () => {
  const runtimeConfig = useRuntimeConfig()
  const state: RootState = reactive({
    menu: null,
    locale: runtimeConfig.VUE_APP_I18N_LOCALE
  });

  // Getters
  const locale = computed({
    get() {
      return state.locale;
    },
    set(locale: string) {
      setLocale(locale);
    },
  });
  const rtl = computed(() =>
    ["fa-IR", "ar", "azIr", "ckb"].includes(state.locale)
  );
  const menu = computed({
    get() {
      return state.menu;
    },
    set(menu: string | number | null) {
      setMenu(menu);
    },
  });
  const percentFormatter = computed(() =>
    Intl.NumberFormat(state.locale, {
      style: "percent",
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    })
  );
  const currencyFormatter = computed(
    (currency: string = "IRR") =>
      Intl.NumberFormat(state.locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 1,
        maximumFractionDigits: 3,
      })
  );
  const formatter = computed(() =>
    Intl.NumberFormat(state.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    })
  );

  // Mutations
  function setMenu(menu: string | number | null) {
    state.menu = menu;
  }
  function setLocale(locale: string) {
    state.locale = locale;
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
