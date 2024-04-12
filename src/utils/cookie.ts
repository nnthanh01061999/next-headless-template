import { setCookie as setCookieLib, getCookie as getCookieLib } from "cookies-next";
import { OptionsType } from "cookies-next/lib/types";

export const getCookie = (key: string, options?: OptionsType) =>
  getCookieLib(key, {
    maxAge: 60 * 60 * 24 * 30,
    ...options,
  });

export const setCookie = (key: string, value: any, options?: OptionsType) =>
  setCookieLib(key, value, {
    maxAge: 60 * 60 * 24 * 30,
    ...options,
  });

export const getCookieJson = (key: string, options?: OptionsType) => {
  const value = getCookie(key, options) as string;
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

export const setCookieJson = (key: string, value: any, options?: OptionsType) =>
  setCookie(key, JSON.stringify(value), {
    maxAge: 60 * 60 * 24 * 30,
    ...options,
  });
