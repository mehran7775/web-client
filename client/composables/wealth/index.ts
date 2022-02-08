import { Store } from "vuex/types"
import { UserState } from "~/types/stores"
import { Wealth, WealthSearchModel } from "~/types"
import { useInstrument, useAxios } from ".."
import { doAsync } from '@/utils'
import wealthManager from "@/repositories/wealth/wealth_manager"

export * from './order'

export function useWealth(store: Store<any>) {
    const userState = store.state.sso.user as UserState

    const axios = useAxios(store)
    const instrumentManager = useInstrument(store)


    async function getWealth(payload: WealthSearchModel): Promise<Array<Wealth> | undefined> {
        if (userState.userName) {
            const wealth = (await wealthManager.getWealth(userState.userName, payload, axios)).data?.data
            doAsync(() =>
                wealth.every((item) =>
                    instrumentManager.updateInstrument(item)
                ))
            return wealth
        }
        else
            return []
    }

    return {
        getWealth
    }

}