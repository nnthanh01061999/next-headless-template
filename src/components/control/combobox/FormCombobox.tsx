import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Combobox, { ComboboxProps, TMode } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { TFormProps } from "@/types/form";
import { useFormContext } from "react-hook-form";

export type TFormComboboxProps = {
  childProps:
    | Omit<ComboboxProps<"multiple", "string">, "value" | "onChange">
    | Omit<ComboboxProps<"multiple", "object">, "value" | "onChange">
    | Omit<ComboboxProps<"single", "string">, "value" | "onChange">
    | Omit<ComboboxProps<"multiple", "object">, "value" | "onChange">;
} & TFormProps;

const afterClass = cn([
  "relative after:absolute after:left-full after:top-0 after:content-['*'] after:text-red-500",
]);

function FormCombobox(props: TFormComboboxProps) {
  const { name, label, description, required, styles, childProps } = props;
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { value, onChange, onBlur } = field;
        return (
          <FormItem className={styles?.itemClass}>
            {label ? (
              <FormLabel
                className={cn(required ? afterClass : "", [styles?.labelClass])}
              >
                {label}
              </FormLabel>
            ) : null}
            <FormControl>
              <Combobox
                {...childProps}
                ref={field.ref}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            </FormControl>
            {description ? (
              <FormDescription className={styles?.descriptionClass}>
                {description}
              </FormDescription>
            ) : null}
            <FormMessage className={styles?.errorMessageClass} />
          </FormItem>
        );
      }}
    />
  );
}

export default FormCombobox;
