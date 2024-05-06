import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { InputHTMLAttributes, forwardRef, useState } from "react";

export interface InputPasswordProps extends InputHTMLAttributes<HTMLInputElement> {}

const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(({ className, type, value, ...props }, ref) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <div className="relative">
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-inputPassword bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "pr-6",
          className,
        )}
        ref={ref}
        {...props}
        type={show ? "text" : "password"}
      />
      {!show ? (
        <EyeOff onClick={() => setShow(true)} className="absolute right-2 top-1/2 size-5 -translate-y-1/2 cursor-pointer" />
      ) : (
        <Eye onClick={() => setShow(false)} className="absolute right-2 top-1/2 size-5 -translate-y-1/2 cursor-pointer" />
      )}
    </div>
  );
});
InputPassword.displayName = "InputPassword";

export { InputPassword };
