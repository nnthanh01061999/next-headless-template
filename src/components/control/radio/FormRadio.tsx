import { TBaseCheckboxProps } from "@/components/ui/base-checkbox";
import BaseRadioGroup from "@/components/ui/base-radio-group";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { IOption } from "@/types";
import { TFormProps } from "@/types/form";
import { useFormContext } from "react-hook-form";

type TFormRadioProps = {
  options: IOption<string>[];
  childProps?: TBaseCheckboxProps;
} & TFormProps;

const afterClass = cn([
  "relative after:absolute after:left-full after:top-0 after:content-['*'] after:text-red-500",
]);

function FormRadio(props: TFormRadioProps) {
  const { name, label, description, required, styles, childProps, options } =
    props;
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            {label ? (
              <FormLabel
                className={cn(required ? afterClass : "", [styles?.labelClass])}
              >
                {label}
              </FormLabel>
            ) : null}
            <FormControl>
              <BaseRadioGroup
                {...childProps}
                options={options}
                value={field.value}
                onValueChange={field.onChange}
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

export default FormRadio;
