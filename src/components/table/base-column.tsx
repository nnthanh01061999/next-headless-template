import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Minus, Plus } from "lucide-react";

export const getSingleSelectionColumn = <T,>(props?: ColumnDef<T>): ColumnDef<T> => {
  return {
    ...props,
    id: "selection",
    cell: ({ row, table }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          table.resetRowSelection();
          row.toggleSelected(!!value);
        }}
        aria-label="Select row"
        className="rounded-full"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 50,
  };
};

export const getMultipleSelectionColumn = <T,>(props?: ColumnDef<T>): ColumnDef<T> => {
  return {
    ...props,
    id: "selection",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
    size: 50,
  };
};

export const getExpandColumn = <T,>(props?: ColumnDef<T>): ColumnDef<T> => {
  return {
    ...props,
    id: "expand",
    enableSorting: false,
    enableHiding: false,
    size: 50,
    header: ({ table }) => (
      <Button variant="ghost" className="w-fit" size="icon" onClick={table.getToggleAllRowsExpandedHandler()}>
        {table.getIsAllRowsExpanded() ? <Minus size={16} /> : <Plus size={16} />}
      </Button>
    ),
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <Button variant="ghost" className="w-fit items-start" size="icon" onClick={row.getToggleExpandedHandler()}>
          {row.getIsExpanded() ? <Minus size={16} /> : <Plus size={16} />}
        </Button>
      ) : null,
  };
};

export const checkDraggableColumn = (headerId: string) => ["selection", "expand"].includes(headerId);
