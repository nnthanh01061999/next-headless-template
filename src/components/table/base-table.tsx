"use client";

import { ColumnDef, TableOptions, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { TableEmpty, TableLoading } from "@/components/table/table-illustration";
import { ScrollArea, ScrollAreaProps } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableDraggableHead, TableHead, TableHeader, TablePinnedCell, TablePinnedHead, TableResize, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Fragment } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  tableOptions?: Omit<TableOptions<TData>, "data" | "columns" | "getCoreRowModel">;
  scrollProps?: ScrollAreaProps;
}
const emptyArray: any[] = [];

export function DataTable<TData, TValue>({ columns, data = [], loading = false, tableOptions, scrollProps }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: data.length ? data : emptyArray,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...tableOptions,
  });
  const ResizeWrapper = tableOptions?.columnResizeMode ? TableResize : Fragment;

  return (
    <DndProvider backend={HTML5Backend}>
      <ScrollArea
        className="w-full rounded-md border"
        {...scrollProps}
        scrollbarProps={{
          ...scrollProps?.scrollbarProps,
          className: cn(["z-[999]", scrollProps?.scrollbarProps?.className]),
        }}
      >
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup, index) => {
              const pinnedLeftHeader = headerGroup.headers.filter((header) => header.column.getIsPinned() === "left");
              const pinnedRightHeader = headerGroup.headers.filter((header) => header.column.getIsPinned() === "right");

              return (
                <TableRow
                  key={headerGroup.id}
                  className="sticky inset-x-0 z-[9999] bg-white shadow-sm"
                  style={{
                    top: `${index * 48}px`,
                  }}
                >
                  {headerGroup.headers.map((header) => {
                    const pinned = header.column.getIsPinned();
                    const isSelectionCol = header.id === "selection";

                    const DraggableWrapper = isSelectionCol || header.colSpan > 1 ? TableHead : TableDraggableHead;

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
                        colSpan={header.colSpan || 1}
                      >
                        <ResizeWrapper table={table} header={header}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </ResizeWrapper>
                      </TablePinnedHead>
                    ) : (
                      <DraggableWrapper
                        key={header.id}
                        style={{
                          minWidth: `${header.getSize() / 16}rem`,
                        }}
                        colSpan={header.colSpan || 1}
                        table={table}
                        header={header}
                      >
                        <ResizeWrapper table={table} header={header}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </ResizeWrapper>
                      </DraggableWrapper>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row) => {
                  const pinnedLeftCell = row.getVisibleCells().filter((cell) => cell.column.getIsPinned() === "left");
                  const pinnedRightCell = row.getVisibleCells().filter((cell) => cell.column.getIsPinned() === "right");
                  return (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => {
                        const pinned = cell.column.getIsPinned();

                        return pinned ? (
                          <TablePinnedCell key={cell.id} pinned={pinned} cell={cell} lefts={pinnedLeftCell} rights={pinnedRightCell}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TablePinnedCell>
                        ) : (
                          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              : !loading && (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <TableEmpty />
                    </TableCell>
                  </TableRow>
                )}
            {loading && table.getRowModel().rows?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-40 text-center" />
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
        {loading ? <TableLoading /> : null}
      </ScrollArea>
    </DndProvider>
  );
}
