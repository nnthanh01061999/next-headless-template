"use client";
import { Note, columns } from "@/app/[locale]/table-virtual-col/_components/columns";
import { VirtualColDataTable } from "@/components/table/virtual-col-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { flatTreeArrayToArrayString } from "@/utils/formatter";
import { ColumnOrderState, ExpandedState, getExpandedRowModel } from "@tanstack/react-table";
import { useState } from "react";

function Page() {
  const [page, setPage] = useState<number>(1);
  const [rowSelection, setRowSelection] = useState({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(flatTreeArrayToArrayString(columns as any, "columns", "id"));

  const fakeData: Note[] = Array(5000)
    .fill(1)
    .map((_, index) => ({
      book: [],
      book_id: index,
      content: `Content ${index}`,
      created_at: "",
      deleted_at: "",
      description: `Description ${index}`,
      id: index,
      name: `Name ${index}`,
      tag: [],
      updated_at: "",
      user_id: index,
      ...Array(100)
        .fill(1)
        .reduce(
          (prev, _, index) => ({
            ...prev,
            [`name${index}`]: "Name" + index,
          }),
          {},
        ),
      children: Array(10)
        .fill(1)
        .map((_, index) => ({
          book: [],
          book_id: index,
          content: `Content ${index}`,
          created_at: "",
          deleted_at: "",
          description: `Description ${index}`,
          id: index,
          name: `Child ${index}`,
          tag: [],
          updated_at: "",
          user_id: index,
        })),
    }));

  return (
    <main className="grid overflow-hidden p-24 font-mono">
      <div className={cn(["overflow-hidden"])}>
        <div className="grid h-full grid-rows-[auto,minmax(0,1fr)] gap-2">
          <div className={cn(["grid grid-flow-col gap-2"])}>
            <Button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
              Prev page
            </Button>
            <Button onClick={() => setPage((prev) => prev + 1)}>Next page</Button>
          </div>

          <div className="grid">
            <VirtualColDataTable
              columns={columns}
              data={fakeData}
              tableOptions={{
                state: {
                  rowSelection,
                  columnOrder,
                  expanded,
                },
                onExpandedChange: setExpanded,
                columnResizeMode: "onChange",
                getSubRows: (row) => row.children,
                onRowSelectionChange: setRowSelection,
                onColumnOrderChange: setColumnOrder,
                getExpandedRowModel: getExpandedRowModel(),
              }}
              scrollProps={{
                scrollbarProps: {
                  className: "data-[orientation=vertical]:mt-36 data-[orientation=vertical]:pb-36",
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
