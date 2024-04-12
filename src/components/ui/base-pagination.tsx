import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationEllipsis, PaginationLink, PaginationNext } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination-mantine";

type TBasePaginationProps = {
  pagination: ReturnType<typeof usePagination>;
};
function BasePagination(props: TBasePaginationProps) {
  const { pagination } = props;
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={pagination.previous} />
        </PaginationItem>
        {pagination.range.map((item, index) => (
          <PaginationItem key={String(item) + String(index)}>
            {item === "dots" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink isActive={pagination.active === item} onClick={() => pagination.setPage(item)}>
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext onClick={pagination.next} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default BasePagination;
