export interface IPaginationParams {
  page: number;
  size: number;
}

export interface IMainUpdatePayload<T> {
  id: number;
  payload: T;
}

export type TParam = string | string[] | null | undefined;
export type TRecord<K extends keyof any, T> = {
  [P in K]: T;
};

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
