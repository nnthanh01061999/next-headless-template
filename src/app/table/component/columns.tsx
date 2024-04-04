"use client";

import {
  getExpandColumn,
  getMultipleSelectionColumn,
} from "@/components/table/base-column";
import { TableGroupHead, TableSortableHead } from "@/components/ui/table";
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
  children?: Note[];
};

export const columns: ColumnDef<Note>[] = [
  getMultipleSelectionColumn(),
  getExpandColumn(),
  {
    id: "id",
    accessorKey: "id",
    header: "Id",
    size: 50,
  },
  {
    id: "name",
    accessorKey: "name",
    size: 200,
    header: () => <TableSortableHead sortKey="name" title="Name" />,
  },
  {
    id: "modified",
    header: () => <TableGroupHead title="Modified">Modified</TableGroupHead>,
    columns: [
      {
        id: "created_at",
        accessorKey: "created_at",
        header: () => (
          <TableSortableHead sortKey="created_at" title="Created At" />
        ),
        size: 300,
      },
      {
        id: "modified_children",
        header: () => (
          <TableGroupHead title="Children">Children</TableGroupHead>
        ),
        columns: [
          {
            id: "deleted_at",
            accessorKey: "deleted_at",
            header: "Deleted At",
            size: 300,
          },
          {
            id: "updated_at",
            accessorKey: "updated_at",
            header: "Updated At",
            size: 300,
          },
        ],
      },
    ],
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Description",
    size: 200,
  },
];
