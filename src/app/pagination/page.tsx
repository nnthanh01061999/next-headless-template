"use client";

import BasePagination from "@/components/ui/base-pagination";
import usePaginationClient from "@/utils/use-pagination-client";

function Page() {
  const { pagination, data } = usePaginationClient({
    data: Array(10000)
      .fill(1)
      .map((_, index) => `data-${index}`),
  });
  return (
    <div>
      <BasePagination pagination={pagination} />
      <div className="grid gap-1">
        {data.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    </div>
  );
}

export default Page;
