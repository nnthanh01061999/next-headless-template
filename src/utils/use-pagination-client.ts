import {
  PaginationParams,
  usePagination,
} from "@/utils/use-pagination-mantine";

type TUsePaginationClientProps<T> = {
  pagination?: Omit<PaginationParams, "total">;
  data: T[];
  size?: number;
};
function usePaginationClient<T>(props: TUsePaginationClientProps<T>) {
  const { pagination, data, size = 10 } = props;
  const orgTotal = Math.floor(data.length / size);
  const total = orgTotal * size >= data.length ? orgTotal : orgTotal + 1;
  const _pagination = usePagination({ ...pagination, total });
  return {
    pagination: _pagination,
    data: data.slice(
      (_pagination.active - 1) * size,
      _pagination.active * size
    ),
  };
}

export default usePaginationClient;
