"use client";

import {
  ColumnDef,
  TableOptions,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  TableEmpty,
  TableLoading,
} from "@/components/table/table-illustration";
import { ScrollArea, ScrollAreaProps } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TablePinnedCell,
  TablePinnedHead,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  tableOptions?: Omit<
    TableOptions<TData>,
    "data" | "columns" | "getCoreRowModel"
  >;
  scrollProps?: ScrollAreaProps;
}

export function DataTable<TData, TValue>({
  columns,
  data = [],
  loading = false,
  tableOptions,
  scrollProps,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...tableOptions,
  });

  return (
    <ScrollArea
      className="rounded-md border w-full"
      {...scrollProps}
      scrollbarProps={{
        ...scrollProps?.scrollbarProps,
        className: cn(["z-[999]", scrollProps?.scrollbarProps?.className]),
      }}
    >
      <Table className="w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup, index) => {
            const pinnedLeftHeader = headerGroup.headers.filter(
              (header) => header.column.getIsPinned() === "left"
            );
            const pinnedRightHeader = headerGroup.headers.filter(
              (header) => header.column.getIsPinned() === "right"
            );

            return (
              <TableRow
                key={headerGroup.id}
                className="sticky z-[9999] inset-x-0 bg-white shadow-sm"
                style={{
                  top: `${index * 48}px`,
                }}
              >
                {headerGroup.headers.map((header) => {
                  const pinned = header.column.getIsPinned();
                  return pinned ? (
                    <TablePinnedHead
                      pinned={pinned}
                      header={header}
                      lefts={pinnedLeftHeader}
                      rights={pinnedRightHeader}
                      key={header.id}
                      style={{
                        minWidth: `${header.getSize() / 16}rem`,
                      }}
                      colSpan={header.column.columns.length || 1}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TablePinnedHead>
                  ) : (
                    <TableHead
                      key={header.id}
                      style={{
                        minWidth: `${header.getSize() / 16}rem`,
                      }}
                      colSpan={header.column.columns.length || 1}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            );
          })}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length
            ? table.getRowModel().rows.map((row) => {
                const pinnedLeftCell = row
                  .getVisibleCells()
                  .filter((cell) => cell.column.getIsPinned() === "left");
                const pinnedRightCell = row
                  .getVisibleCells()
                  .filter((cell) => cell.column.getIsPinned() === "right");
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const pinned = cell.column.getIsPinned();

                      return pinned ? (
                        <TablePinnedCell
                          key={cell.id}
                          pinned={pinned}
                          cell={cell}
                          lefts={pinnedLeftCell}
                          rights={pinnedRightCell}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TablePinnedCell>
                      ) : (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            : !loading && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <TableEmpty />
                  </TableCell>
                </TableRow>
              )}
          {loading && table.getRowModel().rows?.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-40 text-center"
              />
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
      {loading ? <TableLoading /> : null}
    </ScrollArea>
  );
}
