import { Checkbox, CheckboxProps, CheckboxRef } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ReactNode, forwardRef, useId } from "react";

export type TBaseCheckboxProps = {
  id?: string;
  label?: string | ReactNode;
  checkboxProps?: CheckboxProps;
  styles?: {
    containerClass?: string;
    labelClass?: string;
  };
};
const BaseCheckbox = forwardRef<CheckboxRef, TBaseCheckboxProps>(
  ({ id, label, styles, checkboxProps }, ref) => {
    const _id = useId();
    return (
      <div
        className={cn(["flex items-center space-x-2", styles?.containerClass])}
      >
        <Checkbox {...checkboxProps} ref={ref} id={id || _id} />
        <label
          htmlFor={id || _id}
          className={cn([
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            styles?.labelClass,
          ])}
        >
          {label}
        </label>
      </div>
    );
  }
);

BaseCheckbox.displayName = "BaseCheckbox";

export default BaseCheckbox;
