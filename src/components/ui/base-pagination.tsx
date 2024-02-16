import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginationParams, usePagination } from "@/utils/use-pagination-matine";

type TBasePaginationProps = PaginationParams;
function BasePagination(props: TBasePaginationProps) {
  const pagination = usePagination(props);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={pagination.previous} />
        </PaginationItem>
        {pagination.range.map((item) => (
          <PaginationItem key={item}>
            {item === "dots" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={pagination.active === item}
                onClick={() => pagination.setPage(item)}
              >
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
