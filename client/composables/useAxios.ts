import axios, {
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosInstance,
} from "axios";
import { Store } from "vuex/types";
import { ErrorExtractor } from "~/utils/error";
import { Snack } from "~/store/snacks";
import { RootState, UserState } from "~/types/stores";

let instance: AxiosInstance | null = null;

export function useAxios(store: Store<any>): AxiosInstance {
  const user = store.state.sso.user as UserState;
  const app = store.state as RootState;

  if (!instance) {
    instance = axios.create({});

    instance.interceptors.request.use((config) => {
      Object.assign(config, {
        withCredentials: true,
        baseURL: process.env.VUE_APP_Host,
        headers: {
          ...config.headers,
          ...{
            "accept-language": app.locale ?? process.env.VUE_APP_I18N_LOCALE,
          },
        },
      });
      if (user.token) {
        Object.assign(config, {
          headers: {
            ...config.headers,
            ...{
              authorization: user.token,
            },
          },
        });
      }
      return config;
    });

    instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (err) => {
        console.log("error: ", err);
        let error = ErrorExtractor(err);
        if (error.code === 401) {
          //TODO Handel refresh token
          // try {
          //     await user.refreshToken()
          //     return instance?.request(err.config)
          // }
          // catch (err) {
          //     error = ErrorExtractor(err as AxiosError)
          //     store.commit('snacks/showMessage', new Snack('error.' + error.code, 'error'))
          //     if (process.client) {
          //         window.history.pushState({}, "", "/login")
          //     }
          //     // TODO serverside redirect('/login')
          //     return Promise.reject(error)
          // }
        } else {
          store.commit(
            "snacks/showMessage",
            new Snack("error." + error.code, "error")
          );
          return Promise.reject(error);
        }
      }
    );
  }
  return instance as AxiosInstance;
}
