"use client";

import { ColumnDef, TableOptions, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { TableEmpty, TableLoading } from "@/components/table/table-illustration";
import { ScrollArea, ScrollAreaProps } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableDraggableHead, TableHead, TableHeader, TablePinnedCell, TablePinnedHead, TableResize, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Fragment, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useVirtualizer } from "@tanstack/react-virtual";
import { checkDraggableColumn } from "@/components/table/base-column";

interface VirtualRowDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  tableOptions?: Omit<TableOptions<TData>, "data" | "columns" | "getCoreRowModel">;
  scrollProps?: ScrollAreaProps;
}
const emptyArray: any[] = [];

export function VirtualRowDataTable<TData, TValue>({ columns, data = [], loading = false, tableOptions, scrollProps }: VirtualRowDataTableProps<TData, TValue>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data: data.length ? data : emptyArray,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...tableOptions,
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 50, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement: typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1 ? (element) => element?.getBoundingClientRect().height : undefined,
    overscan: 10,
  });

  const ResizeWrapper = tableOptions?.columnResizeMode ? TableResize : Fragment;

  return (
    <DndProvider backend={HTML5Backend}>
      <div ref={tableContainerRef} className="relative h-[500px] overflow-auto rounded-md border">
        <Table className="grid w-full">
          <TableHeader className="sticky top-0 z-[1] grid">
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
                    const pinned = header?.column?.getIsPinned();
                    const draggableColumn = checkDraggableColumn(header.id);

                    const DraggableWrapper = draggableColumn || header?.colSpan > 1 ? TableHead : TableDraggableHead;

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
          <TableBody
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
            }}
            className="relative grid"
          >
            {rowVirtualizer.getVirtualItems()?.length
              ? rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  const pinnedLeftCell = row.getVisibleCells().filter((cell) => cell.column.getIsPinned() === "left");
                  const pinnedRightCell = row.getVisibleCells().filter((cell) => cell.column.getIsPinned() === "right");
                  return (
                    <TableRow
                      key={row.id}
                      data-index={virtualRow.index}
                      ref={(node) => rowVirtualizer.measureElement(node)}
                      data-state={row.getIsSelected() && "selected"}
                      className="absolute flex w-full"
                      style={{
                        transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                      }}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const pinned = cell.column.getIsPinned();
                        return pinned ? (
                          <TablePinnedCell className="flex" key={cell.id} pinned={pinned} cell={cell} lefts={pinnedLeftCell} rights={pinnedRightCell} style={{ width: cell.column.getSize() }}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TablePinnedCell>
                        ) : (
                          <TableCell className="flex" key={cell.id} style={{ width: cell.column.getSize() }}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
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
            {loading && rowVirtualizer.getVirtualItems()?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-40 text-center" />
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
        {loading ? <TableLoading /> : null}
      </div>
    </DndProvider>
  );
}
