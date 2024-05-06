import { cn } from "@/lib/utils";
import { Assign } from "@/types";
import { Search } from "lucide-react";
import { InputHTMLAttributes, forwardRef, useState } from "react";

export interface InputSearchProps
  extends Assign<
    InputHTMLAttributes<HTMLInputElement>,
    {
      onChange: (value: string) => void;
    }
  > {}

const InputSearch = forwardRef<HTMLInputElement, InputSearchProps>(({ className, type, value, onChange, ...props }, ref) => {
  const [currentValue, setCurrentValue] = useState<string>(value?.toString() || "");

  const onSearch = () => {
    onChange?.(currentValue);
  };

  const _onChangeCurrent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(e.target.value);
  };

  return (
    <div className="relative">
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
        value={currentValue}
        onChange={_onChangeCurrent}
      />
      <Search onClick={onSearch} className="absolute right-2 top-1/2 size-5 -translate-y-1/2 cursor-pointer" />
    </div>
  );
});
InputSearch.displayName = "InputSearch";

export { InputSearch };
