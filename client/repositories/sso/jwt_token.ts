/* eslint-disable object-shorthand */
import { AxiosInstance } from "axios";

export async function refreshToken(refresh: string, axios: AxiosInstance) {
  const res = await axios.put("/sso/jwt", { refresh: refresh });
  return res;
}

export async function logout(axios: AxiosInstance) {
  await axios.delete("/sso/jwt");
}

export type dict = { [key: string]: string | number | dict };

export async function login(
  axios: AxiosInstance,
  username: string,
  password: string,
  captcha: string,
  session: dict = {}
) {
  return await axios.post("/sso/jwt", {
    username: username,
    password: password,
    captcha: captcha,
    session: session,
  });
}

export default {
  refreshToken,
  logout,
  login,
};
