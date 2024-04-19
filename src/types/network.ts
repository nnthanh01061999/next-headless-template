export interface IMainResponse<T> {
  code: number;
  reason: string;
  message: string;
  metadata: any;
  data: T;
}

export interface IDataSource<T> {
  items: T[];
  total: number;
  loading?: boolean;
}

export interface IMainResponseAffected {
  rows_affected: number;
}

export interface IMainUpdatePayload<T> {
  id: number | string;
  payload: T;
}

export interface IPaginationParams {
  page: number;
  size: number;
}

export interface IItemIds {
  item_ids: number[];
}
