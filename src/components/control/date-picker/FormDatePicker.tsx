import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import DatePicker from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
import { TFormProps } from "@/types/form";
import { useFormContext } from "react-hook-form";
import { DatePickerProps } from "@/components/ui/date-picker";

export type TFormDatePickerProps = {
  childProps?: Omit<DatePickerProps, "value" | "onChange">;
} & TFormProps;

const afterClass = cn(["relative after:absolute after:left-full after:top-0 after:content-['*'] after:text-red-500"]);

function FormDatePicker(props: TFormDatePickerProps) {
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
            {label ? <FormLabel className={cn(required ? afterClass : "", [styles?.labelClass])}>{label}</FormLabel> : null}
            <FormControl>
              <DatePicker {...childProps} ref={field.ref} value={value} onChange={onChange} />
            </FormControl>
            {description ? <FormDescription className={styles?.descriptionClass}>{description}</FormDescription> : null}
            <FormMessage className={styles?.errorMessageClass} />
          </FormItem>
        );
      }}
    />
  );
}

export default FormDatePicker;
