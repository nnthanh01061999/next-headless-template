import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import BaseCheckbox, { TBaseCheckboxProps } from "@/components/ui/base-checkbox";
import { cn } from "@/lib/utils";
import { TFormProps } from "@/types/form";
import { useFormContext } from "react-hook-form";

type TFormCheckboxProps = {
  childProps?: TBaseCheckboxProps;
} & TFormProps;

const afterClass = cn(["relative after:absolute after:left-full after:top-0 after:content-['*'] after:text-red-500"]);

function FormCheckbox(props: TFormCheckboxProps) {
  const { name, label, description, required, styles, childProps } = props;
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { ref, value, onChange } = field;
        return (
          <FormItem className={styles?.itemClass}>
            {label ? <FormLabel className={cn(required ? afterClass : "", [styles?.labelClass])}>{label}</FormLabel> : null}
            <FormControl>
              <BaseCheckbox
                {...childProps}
                ref={ref}
                checkboxProps={{
                  ...childProps?.checkboxProps,
                  checked: value,
                  onCheckedChange: onChange,
                }}
              />
            </FormControl>
            {description ? <FormDescription className={styles?.descriptionClass}>{description}</FormDescription> : null}
            <FormMessage className={styles?.errorMessageClass} />
          </FormItem>
        );
      }}
    />
  );
}

export default FormCheckbox;
