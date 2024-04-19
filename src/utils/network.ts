import authApi from "@/apis/auth";
import { AUTH, ERROR_CODE_EXPIRED_TOKEN, STATE } from "@/data";
import { getAuthActions } from "@/store/auth-store";
import axios from "axios";
import { getCookieJson } from ".";

export const NETWORK_TIMEOUT = 30000;
export const NETWORK_MESSAGE = "Timeout. Something went wrong!";

export const getLocalAccessToken = () => {
  const data = getCookieJson(STATE);
  return (data?.[AUTH].tokenType ?? "") + " " + (data?.[AUTH]?.accessToken ?? "");
};

export const getLocalRefreshToken = () => {
  const data = getCookieJson(STATE);
  return data?.[AUTH]?.refreshToken ?? "";
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

export const axiosSetToken = (token: string) => {
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

export const updateHeadersForLocale = (locale: string) => {
  // Remove any existing locale interceptor
  if (interceptor !== null) {
    networkHandler.interceptors.request.eject(interceptor);
  }

  // Add the new locale interceptor
  interceptor = networkHandler.interceptors.request.use(
    function (config) {
      config.headers["Accept-Language"] = locale;
      config.headers.Authorization = getLocalAccessToken();
      return config;
    },
    function (error) {
      return Promise.reject(error);
    },
  );
};

networkHandler.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { config, response } = error;
    const status = response?.status;
    const { setToken, logout } = getAuthActions();

    const originalRequest = config;

    if (status === 401) {
      const code = response?.data?.code;
      if (code === ERROR_CODE_EXPIRED_TOKEN && isRefreshing === false) {
        if (!isRefreshing) {
          isRefreshing = true;
          return authApi
            .refreshToken()
            .then((rs) => {
              const token = rs.data;
              isRefreshing = false;
              setToken({
                tokenType: token.token_type,
                accessToken: token.access_token,
                refreshToken: token.refresh_token,
              });
              const tokenFormat = `${token.token_type} ${token.access_token}`;
              axiosSetToken(tokenFormat);
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
            originalRequest.headers.Authorization = token;
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
