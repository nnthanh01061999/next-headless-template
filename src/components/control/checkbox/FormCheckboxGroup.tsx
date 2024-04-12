import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import BaseCheckbox, { TBaseCheckboxProps } from "@/components/ui/base-checkbox";
import { cn } from "@/lib/utils";
import { TFormProps } from "@/types/form";
import { useFormContext } from "react-hook-form";
import { IOption } from "@/types";
import { useId } from "react";

type TFormCheckboxProps = {
  options: IOption<string>[];
  childProps?: TBaseCheckboxProps;
} & TFormProps;

const afterClass = cn(["relative after:absolute after:left-full after:top-0 after:content-['*'] after:text-red-500"]);

function FormCheckbox(props: TFormCheckboxProps) {
  const { name, label, description, required, styles, childProps, options } = props;
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={() => {
        return (
          <FormItem>
            {label ? <FormLabel className={cn(required ? afterClass : "", [styles?.labelClass])}>{label}</FormLabel> : null}
            {options.map((option) => (
              <CheckboxItem key={option.value} option={option} name={name} childProps={childProps} />
            ))}
            {description ? <FormDescription className={styles?.descriptionClass}>{description}</FormDescription> : null}
            <FormMessage className={styles?.errorMessageClass} />
          </FormItem>
        );
      }}
    />
  );
}

export default FormCheckbox;

type TCheckboxItemProps = {
  option: IOption<string>;
  name: string;
  childProps?: TBaseCheckboxProps;
};

const CheckboxItem = (props: TCheckboxItemProps) => {
  const { option, name, childProps } = props;
  const id = useId();
  const { control } = useFormContext();

  return (
    <FormField
      key={option.value}
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem key={option.value} className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <BaseCheckbox
                {...childProps}
                id={id}
                ref={field.ref}
                label={undefined}
                checkboxProps={{
                  ...childProps?.checkboxProps,
                  checked: field.value?.includes(option.value),
                  onCheckedChange: (checked) => {
                    return checked ? field.onChange([...(field?.value || []), option.value]) : field.onChange(field.value?.filter((value: any) => value !== option.value));
                  },
                }}
              />
            </FormControl>
            <FormLabel htmlFor={id} className="font-normal">
              {option.label}
            </FormLabel>
          </FormItem>
        );
      }}
    />
  );
};
