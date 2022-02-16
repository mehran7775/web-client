import { AxiosError, AxiosResponse } from 'axios'
import { computed } from "@nuxtjs/composition-api"
import { Store } from "vuex/types"
import { AnonymousUser, Log, LoginModel, Paginated, PaginatedResult, Setting, User, WatchlistColumns } from "~/types"
import { UserState } from "~/types/stores"
import userManager from '@/repositories/sso/user_manager';
import jwtManager from '~/repositories/sso/jwt_token'
import { GetClientCookies } from '~/utils/cookie'
import { useAxios } from '../useAxios'

export const refreshKey: string = 'jwtRefreshKey';
export const tokenKey: string = 'jwtKey';
export const userKey: string = 'userCache';

export function useUser(store: Store<any>) {
    const state = store.state.sso.user as UserState

    const axios = useAxios(store)

    // Getters
    const refreshingToken = computed({
        get() { return state.renewToken },
        set(val: boolean) { setRefreshingToken(val) }
    })
    const getBookmarks = computed(() => state.user.settings.bookmarks || [])
    const getShourtcuts = computed(() => state.user.settings.shourtcuts || [])
    const getToken = computed(() => state.token)
    const getRefresh = computed(() => state.refresh)
    const me = computed(() => state.user ?? AnonymousUser())
    const isLogin = computed(() => !!(state && state.token))
    const watchList = computed(() => state.user?.settings?.watch_lists ?? {})
    const tryCount = computed(() => state.tryCount)
    const settingsChanged = computed(() => state.settingsChanged)

    // Mutations
    function setHome(data: string) {
        store.commit("sso/user/setHome", data)
    }
    function setRefreshingToken(data: boolean) {
        store.commit("sso/user/renewToken", data)
    }
    function tries(data: { user: string, tries: number }) {
        store.commit("sso/user/tries", data)
    }
    function setToken(data: string) {
        store.commit("sso/user/setToken", data)
    }
    function setRefresh(data: string) {
        store.commit("sso/user/setRefresh", data)
    }
    function logout() {
        store.commit("sso/user/logout")
    }
    function setUser(data: User) {
        store.commit("sso/user/setUser", data)
    }
    function setSettings(data: Setting) {
        store.commit("sso/user/setSettings", data)
    }
    function setCols(data: Array<WatchlistColumns>) {
        store.commit("sso/user/setCols", data)
    }
    function setWatchlist(data: { watchlist: Array<string>, name: string }) {
        store.commit("sso/user/setWatchlist", data)
    }
    function setSettingsChanged(data: { key: string, value: any }) {
        store.commit("sso/user/settingsChanged", data)
    }
    function settingsNotChanged(data: string) {
        store.commit("sso/user/settingsNotChanged", data)
    }

    // Actions TODO Move buisiness here
    async function getUser(userName: string): Promise<User | number> {
        const { data, status } = await userManager.getUser(userName ?? state.userName, axios)
        setUser(data)
        return data || status
    }
    function checkTries(userName: string) {
        const tr = GetClientCookies()[userName + ".tryCount"]
        if (tr && tr != "") {
            tries({ user: userName, tries: parseInt(tr) })
        } else {
            tries({ user: userName, tries: 0 })
        }
    }
    async function login(payload: LoginModel): Promise<number> {
        try {
            refreshingToken.value = true
            tries({ user: payload.userName, tries: state.tryCount + 1 })
            const { data, status } = await jwtManager.login(
                payload.userName,
                payload.password,
                payload.captcha
            )
            setToken('Bearer ' + data.token)
            setRefresh(data.refresh)
            await getUser(payload.userName)
            return status
        } catch (err: unknown) {
            const resp = err as AxiosError<any>
            if (resp.response) {
                if (resp.response.data.tryCount)
                    tries({ user: payload.userName, tries: resp.response.data.tryCount })
                throw err
            }
            throw err
        } finally {
            refreshingToken.value = false
        }
    }
    async function doLogout(): Promise<void> {
        try {
            await jwtManager.logout(axios)
        } finally {
            logout()
        }
    }
    async function refreshToken(): Promise<number> {
        const token = state.refresh
        if (token) {
            try {
                refreshingToken.value = true
                const { data, status } = await jwtManager.refreshToken(token)
                if (status >= 200 && status < 300 && !!data.token) {
                    setToken('Bearer ' + data.token)
                    setRefresh(data.refresh)
                } else if (status >= 400) {
                    logout()
                }
                return status
            } catch (err) {
                logout()
            } finally {
                refreshingToken.value = false
            }
        }
        return 401
    }
    async function update_settings(payload: { path: string, value: any }): Promise<void> {
        try {
            const resp = await userManager.updateUserSettings(payload.path, payload.value, axios)
            if (resp.data.setting) {
                setSettings(resp.data.setting)
                if (process.client)
                    localStorage.setItem(userKey, JSON.stringify(state.user))
            }
            settingsNotChanged(payload.path)
        } catch (e) {
            setSettingsChanged({ key: payload.path, value: null })
            throw e
        }
    }
    async function getProfilePic(name: string): Promise<string> {
        const img: Uint8Array = (await userManager.getProfileImage(name, axios))?.data
        return 'data:image/jpeg;base64,' +
            Buffer.from(new Uint8Array(img)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')).toString('base64');
    }
    async function getLogs(payload: Paginated): Promise<AxiosResponse<PaginatedResult<Log>>> {
        return userManager.getUserLog(state.userName ?? '', payload?.offset, payload?.length, axios)
    }

    return {
        // Getters
        refreshingToken,
        getBookmarks,
        getShourtcuts,
        getToken,
        getRefresh,
        me,
        isLogin,
        watchList,
        tryCount,
        settingsChanged,
        // Mutations
        setHome,
        setRefreshingToken,
        tries,
        setToken,
        setRefresh,
        logout,
        setUser,
        setSettings,
        setCols,
        setWatchlist,
        // Actions
        getUser,
        checkTries,
        login,
        doLogout,
        refreshToken,
        update_settings,
        getProfilePic,
        getLogs,
    }

}