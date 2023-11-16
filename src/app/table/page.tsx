"use client";
import noteApi from "@/apis/note";
import { columns } from "@/app/table/component/columns";
import { DataTable } from "@/components/table/base-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

function Page() {
  const [page, setPage] = useState<number>(1);
  const [rowSelection, setRowSelection] = useState({});

  const { data, refetch, isPending, isFetching, isPlaceholderData } = useQuery({
    queryKey: ["note", page],
    queryFn: () =>
      noteApi.getNotes({
        page,
        size: 20,
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <main className="overflow-hidden grid p-24 font-mono">
      <div className={cn(["overflow-hidden"])}>
        <div className="h-full grid grid-rows-[auto,minmax(0,1fr)] gap-2">
          <div className={cn(["grid gap-2 grid-flow-col "])}>
            <Button onClick={() => refetch()}>Refetch</Button>
            <Button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev page
            </Button>
            <Button
              disabled={page * 5 >= data?.data?.total || isPlaceholderData}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next page
            </Button>
          </div>
          <div className={cn(["grid "])}>
            <DataTable
              columns={columns}
              data={data?.data?.items}
              loading={isPending || isFetching}
              tableOptions={{
                state: {
                  columnPinning: {
                    left: ["selection", "id", "name"],
                    right: ["description"],
                  },
                  rowSelection,
                },
                onRowSelectionChange: setRowSelection,
              }}
              scrollProps={{
                scrollbarProps: {
                  className: "data-[orientation=vertical]:mt-24",
                },
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;
