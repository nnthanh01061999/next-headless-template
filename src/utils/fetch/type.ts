export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
}

export type ResponseType = "json" | "text" | "blob";

export type RequestOption<T> = Pick<Request, "url" | "method"> & {
  method: "CONNECT" | "DELETE" | "GET" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "PATCH";
  isAuth?: boolean;
  headers?: HeadersInit;
  params?: Record<string, any>;
  payload?: Record<string, any>;
  responseType?: ResponseType;
  isRetry?: boolean;
  transformRequest?: (data: T) => any;
  fetchOptions?: RequestInit;
  qsStringifyOptions?: qs.IStringifyOptions;
  throwError?: boolean;
};

export type RequestType<T> = Omit<RequestInit, "body"> & RequestOption<T>;

export type RequestConfig<T> = Partial<RequestType<T>>;

export type SendRequest<T, P> = P & RequestConfig<T>;

export interface ResponseData<T> {
  success: boolean;
  responseData: T;
  errorMessage?: string;
  metadata?: Record<string, any>;
  headers: Headers;
  [key: string]: any;
}

export type SubscriberItemType = (token: string) => void;

export interface RefreshTokenResponse {
  token?: string;
}

export interface ResponseError {
  status?: number;
}

export interface CreateRequestProps {
  refreshToken: () => Promise<RefreshTokenResponse>;
  getToken: () => string;
  onRetryFailed: () => void;
  shouldRefreshToken: (response: ResponseError) => boolean;
  minTokenRefreshDuration?: number;
}
