import { computed } from "@nuxtjs/composition-api"
import { Store } from "vuex/types"
import { RootState } from "@/types/stores"

export function useAsrTrader(store: Store<any>) {
    const state = store.state as RootState

    // Getters
    const locale = computed({
        get() {
            return state.locale
        },
        set(locale: string) {
            setLocale(locale)
        }
    })
    const rtl = computed(() => ['fa', 'ar', 'azIr', 'ckb'].includes(state.locale))
    const menu = computed({
        get() { return state.menuIndex ?? 0 },
        set(menu: number | null) {
            setMenu(menu)
        }
    })
    const percentFormatter = computed(() =>
        Intl.NumberFormat(state.locale, { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 3 }))
    const currencyFormatter = computed(() => (currency: string = 'IRR') => Intl.NumberFormat(state.locale, { style: 'currency', currency: currency, minimumFractionDigits: 3, maximumFractionDigits: 3 }))
    const formatter = computed(() => Intl.NumberFormat(state.locale, { minimumFractionDigits: 0, maximumFractionDigits: 3 }))

    // Mutations
    function setMenu(payload: number | null) {
        store.commit("setMenu", payload)
    }
    function setLocale(payload: string) {
        store.commit("setLocale", payload)
    }

    return {
        locale,
        rtl,
        menu,
        percentFormatter,
        currencyFormatter,
        formatter,
        setMenu,
        setLocale
    }

}