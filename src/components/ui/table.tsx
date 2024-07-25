import * as React from "react";

import { cn } from "@/lib/utils";
import { Assign } from "@/types";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useQueryString } from "@/hooks/use-query-string";
import { Cell, Column, ColumnOrderState, Header, Table as RCTable, type SortDirection } from "@tanstack/react-table";
import { ArrowDown, ArrowDownUp, ArrowUp, Grip, LucideIcon } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";
import { z } from "zod";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
  <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)} {...props} />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn("border-b transition-colors data-[state=selected]:bg-muted", "[&>td]:hover:bg-muted [&>td]:data-[state=selected]:bg-muted [&>td]:hover:data-[state=selected]:bg-muted", className)}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <th ref={ref} className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className)} {...props} />
));
TableHead.displayName = "TableHead";

type TablePinnedHeadProps = Assign<
  React.TdHTMLAttributes<HTMLTableCellElement>,
  {
    pinned: "left" | "right";
    header: Header<any, unknown>;
    lefts: Header<any, unknown>[];
    rights: Header<any, unknown>[];
  }
>;

const TablePinnedHead = ({ pinned, className, children, header, lefts, rights, style, ...props }: TablePinnedHeadProps) => {
  const ref = React.useRef<HTMLTableCellElement>(null);
  const pinnedIndex = header.column.getPinnedIndex();

  const positionLeft = pinnedIndex > 0 ? lefts.slice(0, pinnedIndex).reduce((prev, header) => prev + header.getSize(), 0) : 0;

  const positionRight = pinnedIndex < rights.length - 1 ? rights.slice(pinnedIndex + 1).reduce((prev, header) => prev + header.getSize(), 0) : 0;

  const entry = useIntersectionObserver(ref, {
    root: ref.current?.closest("table"),
    rootMargin: pinned === "right" ? `0px ${-positionRight - 1}px 0px 0px` : `0px 0px 0px ${-positionLeft - 1}px`,
    threshold: 1,
  });

  return (
    <TableHead
      ref={ref}
      className={cn(
        "sticky z-[1000] bg-white",
        entry?.isIntersecting && pinned === "left" && 'left-0 after:absolute after:-right-10 after:bottom-0 after:top-0 after:w-10 after:duration-300 after:content-[""]',
        entry?.isIntersecting && pinned === "right" && 'right-0 before:absolute before:-left-10 before:bottom-0 before:top-0 before:w-10 before:duration-300 before:content-[""]',
        entry?.isIntersecting && "data-[last=true]:sticky-col",
        className,
      )}
      data-last={pinned === "left" ? pinnedIndex === lefts.length - 1 : pinnedIndex === 0}
      style={{
        ...style,
        ...(pinned === "left" ? { left: `${positionLeft}px` } : { right: `${positionRight}px` }),
      }}
      {...props}
    >
      {children}
    </TableHead>
  );
};

const reorderColumn = (draggedColumnId: string, targetColumnId: string, columnOrder: string[]): ColumnOrderState => {
  columnOrder.splice(columnOrder.indexOf(targetColumnId), 0, columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string);
  return [...columnOrder];
};

type TableDraggableHeadProps<TData> = Assign<
  React.TdHTMLAttributes<HTMLTableCellElement>,
  {
    table: RCTable<TData>;
    header: Header<TData, unknown>;
  }
>;

const TableDraggableHead = <T,>({ children, table, header, ...props }: TableDraggableHeadProps<T>) => {
  const { getState, setColumnOrder } = table;
  const { columnOrder } = getState();
  const { column } = header;

  const [, dropRef] = useDrop({
    accept: "column",
    drop: (draggedColumn: Column<T>) => {
      const newColumnOrder = reorderColumn(draggedColumn.id, column.id, columnOrder);
      setColumnOrder(newColumnOrder);
    },
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: "column",
  });

  return (
    <TableHead ref={dropRef as any} colSpan={header.colSpan} style={{ opacity: isDragging ? 0.5 : 1 }} {...props}>
      <div ref={previewRef as any} className="group relative">
        {children}
        <button ref={dragRef as any} className="absolute right-2 top-0 h-full w-fit cursor-pointer text-muted-foreground opacity-0 group-hover:opacity-100">
          <Grip size={16} />
        </button>
      </div>
    </TableHead>
  );
};

export type SortValue = "desc" | undefined | "asc";

const sortLookup: Record<SortDirection | "", { icon: LucideIcon; nextSortValue: SortValue }> = {
  asc: {
    icon: ArrowUp,
    nextSortValue: "desc",
  },
  desc: {
    icon: ArrowDown,
    nextSortValue: undefined,
  },
  "": {
    icon: ArrowDownUp,
    nextSortValue: "asc",
  },
};

function TableSortableHead({ sortKey: key, title }: { sortKey: string; title: string }) {
  const { filter, parse } = useQueryString();
  const { sortKey, sortValue } = parse(
    z.object({
      sortKey: z.string().catch(""),
      sortValue: z.enum(["asc", "desc", ""]).catch(""),
    }),
  );

  const SortIcon = sortLookup[key === sortKey ? sortValue : ""].icon;
  const nextSortValue = sortLookup[key === sortKey ? sortValue : ""].nextSortValue;

  function handleSort() {
    filter({
      sortKey: nextSortValue === undefined ? null : key,
      sortValue: nextSortValue,
    });
  }

  return (
    <div className="flex items-center space-x-1">
      <button
        className={cn([
          "select-none",
          "grid auto-cols-max grid-flow-col items-center gap-1",
          "focus-visible:outline-offset-2 focus-visible:outline-gray-600",
          "relative before:transition-colors",
          "before:absolute before:-inset-x-1 before:-inset-y-0.5 before:-z-[1] before:rounded-lg hover:before:bg-gray-200 [&>span]:hover:text-black",
          "after:absolute after:-inset-x-1 after:-inset-y-0.5",
        ])}
        onClick={handleSort}
      >
        <span>{title}</span>
        <SortIcon size={16} />
      </button>
    </div>
  );
}

const TableGroupHead = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("grid justify-items-center", className)} {...props} />;
};

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
));
TableCell.displayName = "TableCell";

type TablePinnedCellProps = Assign<
  React.TdHTMLAttributes<HTMLTableCellElement>,
  {
    pinned: "left" | "right";
    cell: Cell<any, unknown>;
    lefts: Cell<any, unknown>[];
    rights: Cell<any, unknown>[];
  }
>;

const TablePinnedCell = ({ pinned, className, children, style, cell, lefts, rights, ...props }: TablePinnedCellProps) => {
  const ref = React.useRef<HTMLTableCellElement>(null);
  const pinnedIndex = cell.column.getPinnedIndex();

  const positionLeft = pinnedIndex > 0 ? lefts.slice(0, pinnedIndex).reduce((prev, cell) => prev + cell.column.getSize(), 0) : 0;

  const positionRight = pinnedIndex < rights.length - 1 ? rights.slice(pinnedIndex + 1).reduce((prev, cell) => prev + cell.column.getSize(), 0) : 0;

  const entry = useIntersectionObserver(ref, {
    root: ref.current?.closest("table"),
    rootMargin: pinned === "right" ? `0px ${-positionRight - 1}px 0px 0px` : `0px 0px 0px ${-positionLeft - 1}px`,
    threshold: 1,
  });

  return (
    <TableCell
      ref={ref}
      className={cn(
        "sticky z-[999] bg-white",
        entry?.isIntersecting && pinned === "left" && 'left-0 after:absolute after:-right-10 after:bottom-0 after:top-0 after:w-10 after:duration-300 after:content-[""]',
        entry?.isIntersecting && pinned === "right" && 'right-0 before:absolute before:-left-10 before:bottom-0 before:top-0 before:w-10 before:duration-300 before:content-[""]',
        entry?.isIntersecting && "data-[last=true]:sticky-col",
        className,
      )}
      data-last={pinned === "left" ? pinnedIndex === lefts.length - 1 : pinnedIndex === 0}
      style={{
        ...style,
        ...(pinned === "left" ? { left: `${positionLeft}px` } : { right: `${positionRight}px` }),
      }}
      {...props}
    >
      {children}
    </TableCell>
  );
};

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
));
TableCaption.displayName = "TableCaption";

type TTableResizeProps<TData> = Assign<
  React.HTMLAttributes<HTMLDivElement>,
  {
    table: RCTable<TData>;
    header: Header<TData, unknown>;
  }
>;

const TableResize = React.forwardRef<HTMLDivElement, TTableResizeProps<any>>(({ table, header, className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(["group relative", className])} {...props}>
      {children}
      <div
        {...{
          onMouseDown: header.getResizeHandler(),
          onTouchStart: header.getResizeHandler(),
          className: "group-hover:bg-muted focus:bg-muted absolute top-0 right-0 w-1 h-full cursor-pointer",
          style: {
            transform: header.column.getIsResizing() ? `translateX(${table.getState().columnSizingInfo.deltaOffset}px)` : "",
          },
        }}
      />
    </div>
  );
});

TableResize.displayName = "TableResize";

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TablePinnedCell,
  TablePinnedHead,
  TableDraggableHead,
  TableSortableHead,
  TableGroupHead,
  TableResize,
  TableRow,
};
