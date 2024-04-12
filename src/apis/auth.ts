import { ILoginPayload, ILoginResponse } from "@/types";
import { getBeURL, getLocalRefreshToken, networkHandler } from "@/utils";
import axios, { AxiosResponse } from "axios";

function login(payload: ILoginPayload) {
  return networkHandler.post<unknown, AxiosResponse<ILoginResponse>, unknown>(getBeURL("/auth/sign-in"), { ...payload })?.then((rp) => rp.data);
}

function refreshToken() {
  return axios.post(getBeURL(`/auth/reset-token`), undefined, {
    headers: { Authorization: getLocalRefreshToken() },
  });
}

function refreshTokenServer(token: string) {
  return axios.post(getBeURL(`/auth/reset-token`), undefined, {
    headers: { Authorization: token },
  });
}

function getUserByToken() {
  return networkHandler.get(getBeURL("/user/general-user/find-me")).then((rp) => rp.data);
}

const api = { login, refreshToken, getUserByToken, refreshTokenServer };

export default api;
