import authApi from "@/apis/auth";
import { AUTH, ERROR_CODE_EXPIRED_TOKEN, STATE } from "@/data";
import { getActions } from "@/store/auth-store";
import { getCookieJson } from "@/utils/cookie";
import axios from "axios";

export const NETWORK_TIMEOUT = 30000;
export const NETWORK_MESSAGE = "Timeout. Something went wrong!";

export const getLocalAccessToken = () => {
  const data = getCookieJson(STATE);
  return "Bearer " + (data?.[AUTH]?.accessToken ?? "");
};

export const getLocalRefreshToken = () => {
  const data = getCookieJson(STATE);
  return "Bearer " + data?.[AUTH]?.refreshToken ?? "";
};

export const networkHandler = axios.create({
  timeout: NETWORK_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Authorization: getLocalAccessToken(),
    "Accept-Language": "vi",
  },
});

networkHandler.defaults.timeout = NETWORK_TIMEOUT;
networkHandler.defaults.timeoutErrorMessage = NETWORK_MESSAGE;

let isRefreshing = false;
let failedQueue: Array<{ resolve: any; reject: any }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

let interceptor: number | null = null;

export const axiosRefreshToken = (token: string) => {
  if (interceptor !== null) {
    networkHandler.interceptors.request.eject(interceptor);
  }
  interceptor = networkHandler.interceptors.request.use(
    function (config) {
      config.headers.Authorization = token;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );
};

networkHandler.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    const { config, response } = error;
    const status = response?.status;
    const { setAccessToken, logout } = getActions();

    const originalRequest = config;

    if (status === 401) {
      const code = response?.data?.statusCode;
      if (code === ERROR_CODE_EXPIRED_TOKEN && !isRefreshing) {
        if (!isRefreshing) {
          isRefreshing = true;
          return authApi
            .refreshToken()
            .then((rs) => {
              const token = rs.data.data;
              isRefreshing = false;
              setAccessToken({
                accessToken: token.access_token,
              });
              const tokenFormat = `Bearer ${token.access_token}`;
              axiosRefreshToken(tokenFormat);
              processQueue(null, tokenFormat);
              originalRequest.headers["Authorization"] = tokenFormat;
              return networkHandler(originalRequest);
            })
            .catch((err) => {
              isRefreshing = false;
              processQueue(err, null);
              Promise.reject(err);
              logout();
            });
        }
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return networkHandler(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
    }
    if (response) {
      return Promise.reject(response.data);
    }
    return Promise.reject(error);
  },
);
