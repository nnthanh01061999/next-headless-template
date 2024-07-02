import { cn } from "@/lib/utils";

export type TTableLoadingProps = {
  className?: string;
  title?: string;
};
export const TableLoading = ({ title = "Loading", className }: TTableLoadingProps) => {
  return (
    <div className={cn(["pointer-events-none absolute inset-x-0 top-10 z-[1000] h-full", "grid w-full items-center justify-items-center gap-4", className])}>
      <div className={cn(["absolute inset-x-[1px] top-0 h-[calc(100%_-_2px)] bg-white opacity-70"])} />
      <div className={cn(["z-[200] grid items-center justify-items-center rounded-sm bg-white p-4"])}>{title}</div>
    </div>
  );
};

export type TTableEmptyProps = {
  className?: string;
  title?: string;
};

export const TableEmpty = ({ title = "No results", className }: TTableEmptyProps) => {
  return <div className={cn(["pointer-events-none absolute inset-x-0 top-10 z-[1000] h-full", "grid w-full items-center justify-items-center gap-4", className])}>{title}</div>;
};
