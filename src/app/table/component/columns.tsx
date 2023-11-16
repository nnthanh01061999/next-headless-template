"use client";

import { getMultipleSelectionColumn } from "@/components/table/base-column";
import { SortableTableHead } from "@/components/table/sortable-column";
import { ColumnDef } from "@tanstack/react-table";

export type Note = {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  name: string;
  description: string;
  content: string;
  book_id: number;
  user_id: number;
  book: any;
  tag: any[];
};

export const columns: ColumnDef<Note>[] = [
  getMultipleSelectionColumn(),
  {
    accessorKey: "id",
    header: "Id",
    size: 50,
  },
  {
    accessorKey: "name",
    size: 200,
    header: () => <SortableTableHead sortKey={"name"} title={"Name"} />,
  },
  {
    id: "modified",
    header: () => <div className="grid justify-items-center">Modified</div>,
    columns: [
      {
        accessorKey: "created_at",
        header: () => (
          <SortableTableHead sortKey={"created_at"} title={"Created At"} />
        ),
        size: 300,
      },
      {
        accessorKey: "deleted_at",
        header: "Deleted At",
        size: 300,
      },
      {
        accessorKey: "updated_at",
        header: "Updated At",
        size: 200,
      },
    ],
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 200,
  },
];
