"use client";

import { ColumnDef, TableOptions, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { TableEmpty, TableLoading } from "@/components/table/table-illustration";
import { ScrollAreaProps } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableDraggableHead, TableHead, TableHeader, TablePinnedCell, TablePinnedHead, TableResize, TableRow } from "@/components/ui/table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Fragment, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { checkDraggableColumn } from "@/components/table/base-column";

interface VirtualColDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  tableOptions?: Omit<TableOptions<TData>, "data" | "columns" | "getCoreRowModel">;
  scrollProps?: ScrollAreaProps;
}
const emptyArray: any[] = [];

export function VirtualColDataTable<TData, TValue>({ columns, data = [], loading = false, tableOptions, scrollProps }: VirtualColDataTableProps<TData, TValue>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data: data.length ? data : emptyArray,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...tableOptions,
  });

  const { rows } = table.getRowModel();

  const visibleColumns = table.getVisibleLeafColumns();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 50, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement: typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1 ? (element) => element?.getBoundingClientRect().height : undefined,
    overscan: 10,
  });

  const columnVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    estimateSize: (index) => visibleColumns[index].getSize(), //estimate width of each column for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    horizontal: true,
    overscan: 3, //how many columns to render on each side off screen each way (adjust this for performance)
  });

  const virtualColumns = columnVirtualizer.getVirtualItems();
  const virtualRows = rowVirtualizer.getVirtualItems();

  //different virtualization strategy for columns - instead of absolute and translateY, we add empty columns to the left and right
  let virtualPaddingLeft: number | undefined;
  let virtualPaddingRight: number | undefined;

  if (columnVirtualizer && virtualColumns?.length) {
    virtualPaddingLeft = virtualColumns[0]?.start ?? 0;
    virtualPaddingRight = columnVirtualizer.getTotalSize() - (virtualColumns[virtualColumns.length - 1]?.end ?? 0);
  }

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
                  className="sticky inset-x-0 z-[9999] flex w-full bg-white shadow-sm"
                  style={{
                    top: `${index * 48}px`,
                  }}
                >
                  {virtualPaddingLeft ? (
                    //fake empty column to the left for virtualization scroll padding
                    <th style={{ display: "flex", width: virtualPaddingLeft }} />
                  ) : null}
                  {virtualColumns.map((vc) => {
                    const header = headerGroup.headers[vc.index];
                    if (!header) return <th></th>;
                    const pinned = header.column.getIsPinned();
                    const draggableColumn = checkDraggableColumn(header.id);

                    const DraggableWrapper = draggableColumn || header.colSpan > 1 ? TableHead : TableDraggableHead;

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
                        className="flex items-center"
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
                        className="flex items-center"
                      >
                        <ResizeWrapper table={table} header={header}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </ResizeWrapper>
                      </DraggableWrapper>
                    );
                  })}
                  {virtualPaddingRight ? (
                    //fake empty column to the right for virtualization scroll padding
                    <th style={{ display: "flex", width: virtualPaddingRight }} />
                  ) : null}
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
            {virtualRows?.length
              ? virtualRows.map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  const visibleCells = row.getVisibleCells();
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
                      {virtualPaddingLeft ? (
                        //fake empty column to the left for virtualization scroll padding
                        <td style={{ display: "flex", width: virtualPaddingLeft }} />
                      ) : null}
                      {virtualColumns.map((vc) => {
                        const cell = visibleCells[vc.index];
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
                      {virtualPaddingRight ? (
                        //fake empty column to the right for virtualization scroll padding
                        <td style={{ display: "flex", width: virtualPaddingRight }} />
                      ) : null}
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
