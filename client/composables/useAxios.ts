import { useAsrTrader, useSnacks, useUser } from ".";
import axios, { AxiosError, AxiosInstance } from "axios";
import { defineStore } from "pinia";
import { ErrorExtractor } from "~/utils/error";
import { Snack } from "@/types";

export const useAxios = defineStore("axios", () => {
  const user = useUser();
  const app = useAsrTrader();
  const snacks = useSnacks();

  function createInstance(): AxiosInstance {
    const instance = axios.create({});
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
      if (user.getToken) {
        Object.assign(config, {
          headers: {
            ...config.headers,
            ...{
              authorization: user.getToken,
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
          try {
            await user.refreshToken();
            return instance?.request(err.config);
          } catch (err) {
            error = ErrorExtractor(err as AxiosError);
            snacks.showMessage(new Snack("error." + error.code, "error"));
            if (process.client) {
              window.history.pushState({}, "", "/login");
            }
            // TODO serverside redirect('/login')
            return Promise.reject(error);
          }
        } else {
          snacks.showMessage(new Snack("error." + error.code, "error"));
          return Promise.reject(error);
        }
      }
    );
    return instance;
  }
  const instance = createInstance();
  return {
    createInstance,
  };
});
