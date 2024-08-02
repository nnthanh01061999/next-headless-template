import { noteApiKey } from "@/data/api-key/note";
import { authApiKey } from "./auth";
import { ExtractRouteParams } from "@/types";

export const API_KEY = {
  ...authApiKey,
  ...noteApiKey,
};

export type ApiKey = keyof typeof API_KEY;

export type ApiKeyValue<T extends ApiKey = ApiKey> = (typeof API_KEY)[T];

type ParamUrl<T extends ApiKey> = ExtractRouteParams<T> extends undefined ? {} : ExtractRouteParams<T>;

export const formatUrl = (originalPath: string, params: Record<string, any>) => {
  let url = originalPath;
  Object.keys(params).forEach((key) => {
    url = url.replaceAll(`:${key}`, params[key]);
  });

  return url;
};

type Route<T extends string> = {
  url: T;
  param: ExtractRouteParams<T>;
};

export const getBeURL = <T extends string>({ url, param }: Route<T>) => {
  const basePath = process.env.NEXT_PUBLIC_API_URL + url;
  return param ? formatUrl(basePath, param) : basePath;
};

const a = getBeURL({ url: API_KEY.noteDetail, param: {} });
