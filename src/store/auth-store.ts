import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import { AUTH, STATE } from "@/data";
import { getCookieJson, setCookieJson } from "@/utils/cookie";
import { ExtractState } from "@/types/store";

export type AuthData = {
  logged: boolean;
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
};

type AuthStore = {
  actions: {
    init: () => void;
    login: (data: { tokenType: string; accessToken: string; refreshToken: string }) => void;
    logout: () => void;
    clearTokens: () => void;
    setToken: (data: { tokenType: string; accessToken: string; refreshToken: string }) => void;
    setAccessToken: (data: { accessToken: string }) => void;
  };
} & AuthData;

const setAuthCookies = (data: AuthData) => {
  setCookieJson(STATE, {
    [AUTH]: data,
  });
};

const authStore = createStore<AuthStore>()((set, get) => ({
  logged: false,
  accessToken: undefined,
  refreshToken: undefined,
  tokenType: "Bearer",
  actions: {
    init: () => {
      const state = getCookieJson(STATE);
      const value = state?.[AUTH];
      if (!value) return;
      set({
        ...value,
      });
    },
    login: ({ accessToken, refreshToken, tokenType }) => {
      set({
        logged: true,
        accessToken,
        refreshToken,
        tokenType,
      });
      setAuthCookies({
        logged: true,
        accessToken,
        refreshToken,
        tokenType,
      });
    },
    logout: () => {
      set({
        logged: false,
        accessToken: undefined,
        refreshToken: undefined,
        tokenType: "Bearer",
      });
      setAuthCookies({
        logged: false,
        accessToken: undefined,
        refreshToken: undefined,
        tokenType: "Bearer",
      });
    },

    setToken: ({ accessToken, refreshToken, tokenType }) => {
      set({
        refreshToken,
        accessToken,
        tokenType,
      });
      setAuthCookies({
        logged: get().logged,
        refreshToken,
        accessToken,
        tokenType,
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

type Params<U> = Parameters<typeof useStore<typeof authStore, U>>;

// Selectors
const accessTokenSelector = (state: ExtractState<typeof authStore>) => state.accessToken;
const refreshTokenSelector = (state: ExtractState<typeof authStore>) => state.refreshToken;
const tokenTypeSelector = (state: ExtractState<typeof authStore>) => state.tokenType;
const loggedSelector = (state: ExtractState<typeof authStore>) => state.logged;
const actionsSelector = (state: ExtractState<typeof authStore>) => state.actions;

// getters
export const getAccessToken = () => accessTokenSelector(authStore.getState());
export const getRefreshToken = () => refreshTokenSelector(authStore.getState());
export const getTokenType = () => tokenTypeSelector(authStore.getState());
export const getLogged = () => loggedSelector(authStore.getState());
export const getAuthActions = () => actionsSelector(authStore.getState());

function useAuthStore<U>(selector: Params<U>[1]) {
  return useStore(authStore, selector);
}

// Hooks
export const useAccessToken = () => useAuthStore(accessTokenSelector);
export const useRefreshToken = () => useAuthStore(refreshTokenSelector);
export const useTokenType = () => useAuthStore(tokenTypeSelector);
export const useLogged = () => useAuthStore(loggedSelector);
export const useAuthActions = () => useAuthStore(actionsSelector);
