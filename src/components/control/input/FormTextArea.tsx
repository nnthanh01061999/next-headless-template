import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea, TextareaProps } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { TFormProps } from "@/types/form";
import { useFormContext } from "react-hook-form";

type TFormTextAreaProps = {
  childProps?: TextareaProps;
} & TFormProps;

const afterClass = cn(["relative after:absolute after:left-full after:top-0 after:content-['*'] after:text-red-500"]);

function FormTextArea(props: TFormTextAreaProps) {
  const { name, label, description, required, styles, childProps } = props;
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { value = "", ..._field } = field;
        return (
          <FormItem className={styles?.itemClass}>
            {label ? <FormLabel className={cn(required ? afterClass : "", [styles?.labelClass])}>{label}</FormLabel> : null}
            <FormControl>
              <Textarea {...childProps} value={value} {..._field} />
            </FormControl>
            {description ? <FormDescription className={styles?.descriptionClass}>{description}</FormDescription> : null}
            <FormMessage className={styles?.errorMessageClass} />
          </FormItem>
        );
      }}
    />
  );
}

export default FormTextArea;
