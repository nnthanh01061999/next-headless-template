import { AUTH, STATE } from "@/data";
import { AuthData, getAuthActions } from "@/store/auth-store";
import { getCookieJson } from "@/utils";
import { getBeURL } from "@/utils/share";
import { HttpStatusCode, createRequest } from "./helper";
import { RequestType, ResponseError } from "./type";

const urlRefreshToken = getBeURL("authRefreshToken");

const getTokenUser = () => {
  const data: AuthData | undefined = getCookieJson(STATE)?.[AUTH];
  return `${data?.tokenType ?? "Bearer"} ${data?.accessToken ?? ""}`;
};

const getRefreshTokenUser = () => {
  const data: AuthData | undefined = getCookieJson(STATE)?.[AUTH];
  return `${data?.tokenType ?? "Bearer"} ${data?.refreshToken ?? ""}`;
};

const onRetryFailed = () => {
  const { logout } = getAuthActions();
  logout();
  window.location.replace("/");
};

const shouldRefreshToken = (response: ResponseError) => response.status === HttpStatusCode.UNAUTHORIZED;

const refreshToken = async () => {
  const { setAccessToken } = getAuthActions();
  try {
    const response = await fetch(urlRefreshToken, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getRefreshTokenUser(),
      },
    });
    if (response.ok) {
      const data = await response.json();
      setAccessToken({
        accessToken: data?.data?.access_token,
      });
      return {
        token: `${data?.data?.token_type || "Bearer"} ${data?.data?.access_token}`,
      };
    } else if (response.status === HttpStatusCode.UNAUTHORIZED) {
      onRetryFailed();
      throw new Error("Refresh token is expired");
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to refresh token");
  }
};

const { fetchData } = createRequest({
  refreshToken,
  getToken: getTokenUser,
  onRetryFailed,
  shouldRefreshToken,
  minTokenRefreshDuration: 200,
});

const sendRequest = <T>(props: RequestType<T>) => {
  return fetchData<T>({
    ...props,
  });
};

export { sendRequest };
