import { ILoginPayload, ILoginResponse } from "@/types";
import { getBeURL, getLocalRefreshToken, networkHandler } from "@/utils";
import axios, { AxiosResponse } from "axios";

function signIn(payload: ILoginPayload) {
  return networkHandler.post<unknown, AxiosResponse<ILoginResponse>, unknown>(getBeURL("authSignIn"), { ...payload })?.then((rp) => rp.data);
}

function refreshToken() {
  return axios.post(getBeURL("authRefreshToken"), undefined, {
    headers: { Authorization: getLocalRefreshToken() },
  });
}

function getUserByToken() {
  return networkHandler.get(getBeURL("authGetMe")).then((rp) => rp.data);
}

const authApi = { signIn, refreshToken, getUserByToken };

export default authApi;
