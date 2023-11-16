import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupProps,
} from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { IOption } from "@/types";
import { useId } from "react";

type TBaseRadioGroupProps = {
  options: IOption<string>[];
  styles?: {
    containerClass?: string;
  };
} & RadioGroupProps;

function BaseRadioGroup(props: TBaseRadioGroupProps) {
  const { options, styles, ..._props } = props;

  return (
    <RadioGroup {..._props}>
      {options.map((option) => (
        <BaseRadioGroupItem
          key={option.value}
          option={option}
          className={styles?.containerClass}
        />
      ))}
    </RadioGroup>
  );
}

export default BaseRadioGroup;

type BaseRadioGroupItemProps = {
  option: IOption<string>;
  className?: string;
};

const BaseRadioGroupItem = ({ option, className }: BaseRadioGroupItemProps) => {
  const id = useId();
  return (
    <div
      key={option.value}
      className={cn(["flex items-center space-x-2", className])}
    >
      <RadioGroupItem value={option.value} id={id} />
      <Label htmlFor={id}>{option.label}</Label>
    </div>
  );
};
