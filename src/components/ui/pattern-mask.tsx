import { Input } from "@/components/ui/input";
import { PatternFormat, PatternFormatProps } from "react-number-format";

type TPatternMaskProps = Omit<
  PatternFormatProps,
  "onValueChange" | "onChange"
> & {
  value?: string;
  onChange: (value?: string) => void;
};

function PatternMask(props: TPatternMaskProps) {
  const { value, onChange, ...containProps } = props;
  return (
    <PatternFormat
      {...containProps}
      customInput={Input}
      value={value}
      onValueChange={(e) => {
        onChange(e.value);
      }}
    />
  );
}

export default PatternMask;
