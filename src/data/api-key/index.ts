import { noteApiKey } from "@/data/api-key/note";
import { authApiKey } from "./auth";

export const API_KEY = {
  ...authApiKey,
  ...noteApiKey,
} satisfies Record<string, PathWithOptionalColon>;

export type PathWithOptionalColon = `${string}:${string}/${string}` | `${string}/${string}`;

export type ApiKey = keyof typeof API_KEY;

export type ApiKeyValue<T extends ApiKey = ApiKey> = (typeof API_KEY)[T];

export type ExtractParams<T extends string> = T extends `${infer _Start}:${infer Param}/${infer Rest}`
  ? { [K in Param | keyof ExtractParams<Rest>]: string }
  : T extends `${infer _Start}:${infer Param}`
    ? { [K in Param]: string | number }
    : undefined;

export type Params<T extends ApiKey> = ExtractParams<ApiKeyValue<T>>;
