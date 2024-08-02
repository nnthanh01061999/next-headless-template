import { ApiKey, ApiKeyValue } from "@/data";
import { TParam } from "@/types";

export interface IPaginationProps {
  page?: TParam;
  size?: TParam;
  [key: string]: TParam;
}

export interface IPaginationFilter {
  [key: string]: TParam;
}

export interface IPaginationStates {
  index: number;
  limit: number;
  refresh: boolean;
  total: number;
}

export type Assign<T1 = object, T2 = object> = Omit<T1, keyof T2> & T2;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type UniqueArray<T> = T extends readonly [infer X, ...infer Rest] ? (InArray<Rest, X> extends true ? ["Encountered value with duplicates:", X] : readonly [X, ...UniqueArray<Rest>]) : T;

export type InArray<T, X> = T extends readonly [X, ...infer _Rest] ? true : T extends readonly [X] ? true : T extends readonly [infer _, ...infer Rest] ? InArray<Rest, X> : false;

export type ExtractRouteParams<T extends string> = T extends `${infer _Start}:${infer Param}/${infer Rest}`
  ? { [K in Param | keyof ExtractRouteParams<Rest>]: string }
  : T extends `${infer _Start}:${infer Param}`
    ? { [K in Param]: string }
    : undefined;

export type Route<T extends string> = {
  url: T;
  param: ExtractRouteParams<string>;
};

type a = ExtractRouteParams<"id/:a">;
