import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import { AUTH, STATE } from "@/data";
import { getCookieJson, setCookieJson } from "@/utils/cookie";

export type AuthData = {
  logged: boolean;
  accessToken: string | undefined;
  refreshToken: string | undefined;
};

type AuthStore = {
  actions: {
    init: () => void;
    clearTokens: () => void;
    setToken: (data: { accessToken: string; refreshToken: string }) => void;
    setAccessToken: (data: { accessToken: string }) => void;
    login: (data: { accessToken: string; refreshToken: string }) => void;
    logout: () => void;
  };
} & AuthData;

const setAuthCookies = (data: AuthData) => {
  setCookieJson(STATE, {
    [AUTH]: data,
  });
};

const defaultEmployee = {
  user_id: "",
  employee_id: "",
  name: "",
  phone: "",
  email: "",
  image_url: "",
};

const authStore = createStore<AuthStore>()((set, get) => ({
  logged: false,
  accessToken: undefined,
  refreshToken: undefined,
  employee: defaultEmployee,
  actions: {
    init: () => {
      const state = getCookieJson(STATE);
      const value = state?.[AUTH];
      if (!value) return;
      set({
        ...value,
      });
    },
    login: ({ accessToken, refreshToken }) => {
      set({
        logged: true,
        accessToken,
        refreshToken,
      });
      setAuthCookies({
        logged: true,
        accessToken,
        refreshToken,
      });
    },
    logout: () => {
      set({
        logged: false,
        accessToken: undefined,
        refreshToken: undefined,
      });
      setAuthCookies({
        logged: false,
        accessToken: undefined,
        refreshToken: undefined,
      });
    },

    setToken: ({ accessToken, refreshToken }) => {
      set({
        refreshToken,
        accessToken,
      });
      setAuthCookies({
        logged: get().logged,
        refreshToken,
        accessToken,
      });
    },

    setAccessToken: ({ accessToken }) => {
      set({
        accessToken,
      });
      setAuthCookies({
        logged: get().logged,
        accessToken,
        refreshToken: get().refreshToken,
      });
    },

    clearTokens: () => {
      set({
        accessToken: undefined,
        refreshToken: undefined,
      });
      setAuthCookies({
        logged: get().logged,
        accessToken: undefined,
        refreshToken: undefined,
      });
    },
  },
}));

export type ExtractState<S> = S extends {
  getState: () => infer T;
}
  ? T
  : never;

type Params<U> = Parameters<typeof useStore<typeof authStore, U>>;

// Selectors
const accessTokenSelector = (state: ExtractState<typeof authStore>) => state.accessToken;
const refreshTokenSelector = (state: ExtractState<typeof authStore>) => state.refreshToken;
const loggedSelector = (state: ExtractState<typeof authStore>) => state.logged;

const actionsSelector = (state: ExtractState<typeof authStore>) => state.actions;

// getters
export const getAccessToken = () => accessTokenSelector(authStore.getState());
export const getRefreshToken = () => refreshTokenSelector(authStore.getState());
export const getLogged = () => loggedSelector(authStore.getState());
export const getActions = () => actionsSelector(authStore.getState());

function useAuthStore<U>(selector: Params<U>[1]) {
  return useStore(authStore, selector);
}

// Hooks
export const useAccessToken = () => useAuthStore(accessTokenSelector);
export const useRefreshToken = () => useAuthStore(refreshTokenSelector);
export const useLogged = () => useAuthStore(loggedSelector);
export const useActions = () => useAuthStore(actionsSelector);
