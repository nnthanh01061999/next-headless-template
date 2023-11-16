"use client";
import { cn } from "@/lib/utils";
import { useQueryString } from "@/utils/use-query-string";
import { type SortDirection } from "@tanstack/react-table";
import { z } from "zod";
import { ArrowDown, ArrowDownUp, ArrowUp, LucideIcon } from "lucide-react";

export type SortValue = "desc" | undefined | "asc";

export function SortableTableHead({
  sortKey: key,
  title,
}: {
  sortKey: string;
  title: string;
}) {
  const { filter, parse } = useQueryString();
  const { sortKey, sortValue } = parse(
    z.object({
      sortKey: z.string().catch(""),
      sortValue: z.enum(["asc", "desc", ""]).catch(""),
    })
  );

  const SortIcon = sortLookup[key === sortKey ? sortValue : ""].icon;
  const nextSortValue =
    sortLookup[key === sortKey ? sortValue : ""].nextSortValue;

  function handleSort() {
    filter({
      sortKey: nextSortValue === undefined ? null : key,
      sortValue: nextSortValue,
    });
  }

  return (
    <div className="flex space-x-1 items-center">
      <button
        className={cn([
          "select-none",
          "grid grid-flow-col auto-cols-max items-center gap-1",
          "focus-visible:outline-gray-600 focus-visible:outline-offset-2",
          "relative before:transition-colors",
          "before:absolute before:-z-[1] before:-inset-x-1 before:-inset-y-0.5 before:rounded-lg hover:before:bg-gray-200 [&>span]:hover:text-black",
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

const sortLookup: Record<
  SortDirection | "",
  { icon: LucideIcon; nextSortValue: SortValue }
> = {
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
