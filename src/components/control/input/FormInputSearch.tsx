import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputSearch, InputSearchProps } from "@/components/ui/input-search";
import { cn } from "@/lib/utils";
import { TFormProps } from "@/types/form";
import { useFormContext } from "react-hook-form";

type TFormInputSearchProps = {
  childProps?: InputSearchProps;
} & TFormProps;

const afterClass = cn([
  "relative after:absolute after:left-full after:top-0 after:content-['*'] after:text-red-500",
]);

function FormInputSearch(props: TFormInputSearchProps) {
  const { name, label, description, required, styles, childProps } = props;
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { value = "", onChange, ..._field } = field;
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
              <InputSearch
                {...childProps}
                value={value}
                {..._field}
                onChange={onChange}
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

export default FormInputSearch;
