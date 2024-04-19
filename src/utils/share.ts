import { ReadonlyURLSearchParams } from "next/navigation";
import { API_KEY } from "@/data";

export const getPathNameWithoutLocale = (url: string = "", locale?: string) => {
  return typeof url === "string" && url?.startsWith(`/${locale}`) ? "/" + url.split("/")?.slice(2).join("/") : url;
};

export const formatUrl = (originalPath: string, params: Record<string, any>) => {
  let url = originalPath;
  Object.keys(params).forEach((key) => {
    url = url.replaceAll(`:${key}`, params[key]);
  });

  return url;
};

export const getBeURL = (path: keyof typeof API_KEY, paramUrl?: Record<string, any>) => {
  const basePath = process.env.NEXT_PUBLIC_API_URL + API_KEY[path];
  return paramUrl ? formatUrl(basePath, paramUrl) : basePath;
};

export const getPaginationFromSearchParams = (query: ReadonlyURLSearchParams) => {
  const index = query.get("index");
  const limit = query.get("limit");
  const total = query.get("total");
  const refresh = query.get("refresh");
  return {
    index: index || undefined,
    limit: limit || undefined,
    total: total || undefined,
    refresh: refresh || undefined,
  };
};
