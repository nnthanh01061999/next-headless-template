import { cn } from "@/lib/utils";

export type TTableLoadingProps = {
  className?: string;
  title?: string;
};
export const TableLoading = ({
  title = "Loading",
  className,
}: TTableLoadingProps) => {
  return (
    <div
      className={cn([
        "absolute top-10 h-full z-[1000] inset-x-0 pointer-events-none",
        "grid items-center justify-items-center gap-4 w-full ",
        className,
      ])}
    >
      <div
        className={cn([
          "absolute top-0 inset-x-[1px] bg-white opacity-70 h-[calc(100%_-_2px)]",
        ])}
      />
      <div
        className={cn([
          "z-[200] p-4 grid justify-items-center items-center bg-white rounded-sm",
        ])}
      >
        {title}
      </div>
    </div>
  );
};

export type TTableEmptyProps = {
  className?: string;
  title?: string;
};

export const TableEmpty = ({
  title = "No results",
  className,
}: TTableEmptyProps) => {
  return (
    <div
      className={cn([
        "absolute top-10 h-full z-[1000] inset-x-0 pointer-events-none",
        "grid items-center justify-items-center gap-4 w-full ",
        className,
      ])}
    >
      {title}
    </div>
  );
};
