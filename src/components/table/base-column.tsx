import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

export const getSingleSelectionColumn = <T,>(
  props?: ColumnDef<T>
): ColumnDef<T> => {
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

export const getMultipleSelectionColumn = <T,>(
  props?: ColumnDef<T>
): ColumnDef<T> => {
  return {
    ...props,
    id: "selection",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 50,
  };
};
