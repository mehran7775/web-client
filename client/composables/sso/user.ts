import { AxiosError, AxiosResponse } from 'axios'
import { computed } from "@nuxtjs/composition-api"
import { Store } from "vuex/types"
import { AnonymousUser, Log, LoginModel, Paginated, PaginatedResult, Setting, User, WatchlistColumns } from "~/types"
import { UserState } from "~/types/stores"

export function useUser(store: Store<any>) {
    const state = store.state.sso.user as UserState

    // Getters
    const refreshingToken = computed(() => state.renewToken)
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

    // Actions TODO Move buisiness here
    async function getUser(data: string): Promise<User | number> {
        return await store.dispatch("sso/user/getUser", data)
    }
    function checkTries(data: string) {
        store.dispatch("sso/user/checkTries", data)
    }
    async function login(data: LoginModel): Promise<number> {
        return await store.dispatch("sso/user/login", data)
    }
    async function doLogout(): Promise<void> {
        return await store.dispatch("sso/user/logout")
    }
    async function refreshToken(): Promise<number> {
        return await store.dispatch("sso/user/refreshToken")
    }
    async function update_settings(data: { path: string, value: any }): Promise<void> {
        return await store.dispatch("sso/user/update_settings", data)
    }
    async function getProfilePic(data: string): Promise<string> {
        return await store.dispatch("sso/user/getProfilePic", data)
    }
    async function getLogs(data: Paginated): Promise<AxiosResponse<PaginatedResult<Log>>> {
        return await store.dispatch("sso/user/getLogs", data)
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