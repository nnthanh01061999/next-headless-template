import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import AsyncCombobox, {
  AsyncComboboxProps,
} from "@/components/ui/async-combobox";
import { cn } from "@/lib/utils";
import { TFormProps } from "@/types/form";
import { useFormContext } from "react-hook-form";

export type TFormAsyncComboboxProps = {
  childProps: Omit<
    AsyncComboboxProps,
    "value" | "onChange" | "options" | "valueMode"
  >;
} & TFormProps;

const afterClass = cn([
  "relative after:absolute after:left-full after:top-0 after:content-['*'] after:text-red-500",
]);

function FormAsyncCombobox(props: TFormAsyncComboboxProps) {
  const { name, label, description, required, styles, childProps } = props;
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { ref, value, onChange, onBlur } = field;
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
              <AsyncCombobox
                {...childProps}
                ref={ref}
                valueMode="object"
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

export default FormAsyncCombobox;
