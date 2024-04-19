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
