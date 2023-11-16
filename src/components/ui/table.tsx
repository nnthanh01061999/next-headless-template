import * as React from "react";

import { cn } from "@/lib/utils";
import { useIntersectionObserver } from "@/utils/use-intersection-observer";
import { Assign } from "@/types";
import { Cell, Header } from "@tanstack/react-table";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={cn("w-full caption-bottom text-sm", className)}
    {...props}
  />
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50  data-[state=selected]:bg-muted ",
      "[&>td]:hover:bg-muted [&>td]:data-[state=selected]:bg-muted [&>td]:hover:data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
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

const TablePinnedHead = ({
  pinned,
  className,
  children,
  header,
  lefts,
  rights,
  style,
  ...props
}: TablePinnedHeadProps) => {
  const ref = React.useRef<HTMLTableCellElement>(null);
  const pinnedIndex = header.column.getPinnedIndex();

  const positionLeft =
    pinnedIndex > 0
      ? lefts
          .slice(0, pinnedIndex)
          .reduce((prev, header) => prev + header.getSize(), 0)
      : 0;

  const positionRight =
    pinnedIndex < rights.length - 1
      ? rights
          .slice(pinnedIndex + 1)
          .reduce((prev, header) => prev + header.getSize(), 0)
      : 0;

  const entry = useIntersectionObserver(ref, {
    root: ref.current?.closest("table"),
    rootMargin:
      pinned === "right"
        ? `0px ${-positionRight - 1}px 0px 0px`
        : `0px 0px 0px ${-positionLeft - 1}px`,
    threshold: 1,
  });

  return (
    <TableHead
      ref={ref}
      className={cn(
        "sticky bg-white z-[1000]",
        pinned === "left" &&
          'left-0 after:content-[""] after:absolute after:top-0 after:-right-10 after:bottom-0 after:w-10 after:duration-300',
        pinned === "right" &&
          'right-0 before:content-[""] before:absolute before:top-0 before:-left-10 before:bottom-0 before:w-10 before:duration-300',
        entry?.isIntersecting && "data-[last=true]:sticky-col",
        className
      )}
      data-last={
        pinned === "left" ? pinnedIndex === lefts.length - 1 : pinnedIndex === 0
      }
      style={{
        ...style,
        ...(pinned === "left"
          ? { left: `${positionLeft}px` }
          : { right: `${positionRight}px` }),
      }}
      {...props}
    >
      {children}
    </TableHead>
  );
};

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
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

const TablePinnedCell = ({
  pinned,
  className,
  children,
  style,
  cell,
  lefts,
  rights,
  ...props
}: TablePinnedCellProps) => {
  const ref = React.useRef<HTMLTableCellElement>(null);
  const pinnedIndex = cell.column.getPinnedIndex();

  const positionLeft =
    pinnedIndex > 0
      ? lefts
          .slice(0, pinnedIndex)
          .reduce((prev, cell) => prev + cell.column.getSize(), 0)
      : 0;

  const positionRight =
    pinnedIndex < rights.length - 1
      ? rights
          .slice(pinnedIndex + 1)
          .reduce((prev, cell) => prev + cell.column.getSize(), 0)
      : 0;

  const entry = useIntersectionObserver(ref, {
    root: ref.current?.closest("table"),
    rootMargin:
      pinned === "right"
        ? `0px ${-positionRight - 1}px 0px 0px`
        : `0px 0px 0px ${-positionLeft - 1}px`,
    threshold: 1,
  });

  return (
    <TableCell
      ref={ref}
      className={cn(
        "sticky bg-white z-[999]",
        entry?.isIntersecting &&
          pinned === "left" &&
          'left-0 after:content-[""] after:absolute after:top-0 after:-right-10 after:bottom-0 after:w-10 after:duration-300',
        entry?.isIntersecting &&
          pinned === "right" &&
          'right-0 before:content-[""] before:absolute before:top-0 before:-left-10 before:bottom-0 before:w-10 before:duration-300',
        entry?.isIntersecting && "data-[last=true]:sticky-col",
        className
      )}
      data-last={
        pinned === "left" ? pinnedIndex === lefts.length - 1 : pinnedIndex === 0
      }
      style={{
        ...style,
        ...(pinned === "left"
          ? { left: `${positionLeft}px` }
          : { right: `${positionRight}px` }),
      }}
      {...props}
    >
      {children}
    </TableCell>
  );
};

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TablePinnedHead,
  TableRow,
  TableCell,
  TablePinnedCell,
  TableCaption,
};
