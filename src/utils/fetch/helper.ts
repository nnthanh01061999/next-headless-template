import qs from "qs";
import { CreateRequestProps, RequestType, ResponseData, ResponseType, SubscriberItemType } from "./type";

export const HttpStatusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
};

const RequestPropertyInit: RequestType<any> = {
  url: "",
  method: "GET",
  transformRequest: (data) => data,
  responseType: "json",
  qsStringifyOptions: undefined,
  isAuth: true,
};

export const convertResponse = async (response: Response, responseType: ResponseType): Promise<any> => {
  switch (responseType) {
    case "json":
      return await response.json();
    case "text":
      return await response.text();
    case "blob":
      return await response.blob();
    default:
      return response;
  }
};

export const createRequest = (props: CreateRequestProps) => {
  const { refreshToken, getToken = () => "", onRetryFailed = () => undefined, shouldRefreshToken = () => false, minTokenRefreshDuration = 200 } = props;

  let isTokenRefreshing = false;
  let refreshSubscribers: Array<SubscriberItemType> = [];
  let lastRefreshTime = Date.now();

  // Function to add a request subscriber to the pending queue
  const addSubscriber = (subscriber: SubscriberItemType) => {
    refreshSubscribers.push(subscriber);
  };

  // Execute all api expired
  const executeAndClearSubscriber = (token = "") => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
  };

  // Handle refresh token
  const handleRefreshToken = async () => {
    try {
      const response = await refreshToken();
      if (response?.token) {
        executeAndClearSubscriber(response.token);
        lastRefreshTime = Date.now();
        isTokenRefreshing = false;
        return response;
      }
    } catch (error) {
      console.log(error instanceof Error ? error.message : "Failed to refresh token");
      throw new Error(error instanceof Error ? error.message : "Failed to refresh token");
    }
  };

  const fetchData = async <T>(props = RequestPropertyInit): Promise<ResponseData<T>> => {
    const { url, method, params, payload, headers, responseType = "json", isRetry, qsStringifyOptions, fetchOptions, isAuth = true, throwError = true, transformRequest } = props;

    let resource = url;

    const token = getToken();
    const isAuthenticated = token && isAuth;

    const requestHeaders = {
      ...(isAuthenticated ? { Authorization: token } : {}),
      ...headers,
    };

    const requestOption: RequestInit = {
      ...fetchOptions,
      method,
      headers: requestHeaders,
    };
    if (method === "GET" && params) {
      resource = `${resource}?${qs.stringify(params, qsStringifyOptions)}`;
    } else {
      requestOption.body = transformRequest?.(payload) || payload;
    }

    try {
      const response = await fetch(resource, requestOption);
      if (response.ok) {
        const data = await convertResponse(response, responseType);

        return {
          responseData: data,
          success: true,
          headers: response.headers,
        };
      }

      if (isRetry) {
        onRetryFailed();
        throw new Error("Not permission");
      }

      if (!shouldRefreshToken(response)) {
        const errorData = await convertResponse(response, responseType);
        throw errorData;
      }

      const lastRefreshDuration = Date.now() - lastRefreshTime;

      if (!isTokenRefreshing) {
        // Prevent call multi api same Promise in Chrome
        if (lastRefreshDuration < minTokenRefreshDuration) {
          return fetchData({
            ...props,
            headers: {
              ...props.headers,
              Authorization: getToken(),
            },
            isRetry: true,
          });
        }
        isTokenRefreshing = true;
        handleRefreshToken();
      }
      const fetchDataQueue: Promise<ResponseData<any>> = new Promise((resolve) => {
        addSubscriber((token) => {
          resolve(
            fetchData({
              ...props,
              headers: {
                ...props.headers,
                Authorization: token,
              },
              isRetry: true,
            }),
          );
        });
      });
      return fetchDataQueue;
    } catch (error) {
      let errData: any = {};
      if (error instanceof Error) {
        errData.message = error.message;
      } else {
        errData = error;
      }

      if (throwError) {
        throw Error(errData);
      }
      return {
        success: false,
        errorMessage: errData?.message,
        metadata: errData?.metadata,
        responseData: {} as T,
        headers: errData.headers,
      };
    }
  };

  return { fetchData };
};
