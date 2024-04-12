import Combobox, { ComboboxProps, TMode, TValueMode } from "@/components/ui/combobox";
import { DEFAULT_INDEX, DEFAULT_LIMIT } from "@/data";
import { useDebounceValue } from "@/hooks/use-debounce-value";
import { usePagination } from "@/hooks/use-pagination";
import { IOption } from "@/types";
import { networkHandler } from "@/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { get } from "lodash";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";

export type IAsyncSelectParams = {
  page: number;
  size: number;
  search?: string;
  [key: string]: any;
};

export type IAsyncSelectState = {
  focus: boolean;
  options: IOption<string | number>[];
  search?: string;
};

export type TAsyncComboboxSearchProps = {
  searchThreshold?: number;
  searchKey?: string;
  searchLocal?: boolean;
  searchDebounce?: number;
};

type TAsyncComboboxConfigProps = {
  name: string;
  url: string;
  valueField: string | string[];
  labelField: string | string[];
  responseKey: string;
  totalKey?: string;
  pageKey?: string;
  sizeKey?: string;
  size?: number;
  additionalOptions?: IOption<any>[];
  lastOptions?: IOption<any>[];
  otherFilters?: Record<string, any>;
  search?: TAsyncComboboxSearchProps;
  isCallbackInEveryFetch?: boolean;
  callback?: (options: any) => void;
  renderLabel?: (label: string) => string;
};

export interface AsyncComboboxProps extends ComboboxProps<TMode, TValueMode> {
  config: TAsyncComboboxConfigProps;
  axiosConfig?: AxiosRequestConfig<any>;
}

const AsyncCombobox = forwardRef<React.ElementRef<typeof Combobox>, Omit<AsyncComboboxProps, "options">>((props, ref) => {
  const { config, axiosConfig, ...comboboxProps } = props;
  const {
    name,
    url,
    responseKey,
    totalKey = "data.total",
    valueField,
    labelField,
    pageKey = "page",
    sizeKey = "size",
    size = DEFAULT_LIMIT,
    search,
    additionalOptions = [],
    otherFilters,
    isCallbackInEveryFetch = false,
    callback,
    renderLabel,
  } = config;

  const { searchThreshold = 0, searchKey, searchLocal, searchDebounce } = search ?? {};
  const firstCall = useRef<any>(null);
  const [state, setState] = useState<IAsyncSelectState>(() => ({
    focus: false,
    options: [],
    search: undefined,
  }));

  const debounceSearch = useDebounceValue(state.search, searchDebounce ?? 500);

  const { backToFirstPage, onChangeNextPage, getNextPage } = usePagination({
    page: "1",
    size: size + "",
  });

  const handleFetch = (data: { page: number; size: number; search: string }) => {
    const { page, size } = data;

    return networkHandler
      .get(url, {
        params: {
          [pageKey]: page ?? null,
          [sizeKey]: size,
          ...otherFilters,
          ...(searchKey ? { [searchKey]: debounceSearch ?? undefined } : undefined),
        },
        ...axiosConfig,
      })
      .then((rp) => {
        return rp.data;
      });
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
    queryKey: [`async-select-${name}`, debounceSearch],
    queryFn: ({ pageParam }) => handleFetch(pageParam),
    retry: false,
    initialPageParam: {
      page: DEFAULT_INDEX,
      size: DEFAULT_LIMIT,
      search: debounceSearch ?? "",
    },
    getNextPageParam: (lastPage) => {
      const nextPage = getNextPage(get(lastPage, totalKey));
      return nextPage
        ? {
            page: nextPage,
            size: size,
            search: debounceSearch ?? "",
          }
        : undefined;
    },
    enabled: !!state.focus && (state.search ? state.search?.length >= searchThreshold : true),
    staleTime: 0,
  });

  const onFocus = () => {
    setState((prev) => ({ ...prev, focus: true }));
  };

  const onSearch = (value: string) => {
    setState((prev) => ({ ...prev, search: value }));
    backToFirstPage();
  };

  const onLoadMore = () => {
    setState((prev) => ({ ...prev, refresh: false }));
    fetchNextPage();
    onChangeNextPage();
  };

  const onScroll = (e: any) => {
    const { scrollTop, scrollHeight, offsetHeight } = e.currentTarget;
    if (!(isLoading ?? isFetchingNextPage) && scrollTop + offsetHeight >= scrollHeight && hasNextPage) {
      onLoadMore();
    }
  };

  const getValueFromKey = (data: any, key: string | string[]) => {
    if (typeof key === "string") {
      return data?.[key];
    } else if (Array.isArray(key)) {
      return key
        .map((item) => get(data, item, undefined))
        ?.filter((item) => !!item)
        ?.join(" - ");
    }
  };

  const additionalOptionsFormat = useMemo(() => {
    return additionalOptions
      ? additionalOptions?.map((item) => {
          let label = item?.label;
          label = label && typeof label === "string" && renderLabel instanceof Function ? renderLabel(label) : label;
          const value = getValueFromKey(item, valueField);
          return {
            value: String(value),
            label,
          };
        })
      : [];
  }, [additionalOptions, renderLabel, valueField]);

  const allOptionsFormat = useMemo(() => {
    return data?.pages
      ? data?.pages?.reduce((prev, page) => {
          const pageData = responseKey ? get(page, responseKey, undefined) : page;
          const options = pageData?.map((item: any) => {
            let label = "";
            const value = getValueFromKey(item, valueField);

            if (typeof labelField === "string") {
              label = item?.[labelField];
              label = renderLabel instanceof Function ? renderLabel(label) : label;
            } else {
              label = getValueFromKey(item, labelField);
            }

            return {
              value: String(value),
              label,
            };
          });
          return [...prev, ...options];
        }, [])
      : [];
  }, [data?.pages, labelField, renderLabel, responseKey, valueField]);

  const allOptions = useMemo(() => {
    return [...additionalOptionsFormat, ...allOptionsFormat];
  }, [additionalOptionsFormat, allOptionsFormat]);

  const _handleCallback = useCallback(() => {
    if (callback instanceof Function) {
      const options = allOptions;

      if (!isCallbackInEveryFetch) {
        if (!firstCall.current) {
          firstCall.current = true;
          callback(options);
        }
      } else {
        callback(options);
      }
    }
  }, [allOptions, callback, isCallbackInEveryFetch]);

  useEffect(() => {
    _handleCallback();
  }, [_handleCallback]);

  return (
    <Combobox
      {...comboboxProps}
      ref={ref}
      loading={!isError && (isLoading ?? isFetchingNextPage)}
      onSearch={!searchLocal ? onSearch : undefined}
      scrollProps={{
        onScroll,
      }}
      triggerProps={{
        onFocus,
      }}
      options={allOptions}
      maxItemScroll={size - 1}
    />
  );
});

AsyncCombobox.displayName = "AsyncCombobox";

export default AsyncCombobox;
