import { Input } from "@/components/ui/input";
import { NumericFormat, NumericFormatProps } from "react-number-format";

type TNumberMaskProps = Omit<NumericFormatProps, "onValueChange" | "onChange"> & {
  value?: number;
  onChange: (value?: number) => void;
};

function NumberMask(props: TNumberMaskProps) {
  const { value, onChange, ...containProps } = props;
  return (
    <NumericFormat
      allowLeadingZeros
      thousandSeparator=","
      customInput={Input}
      {...containProps}
      value={value}
      onValueChange={(e) => {
        onChange(e.floatValue);
      }}
    />
  );
}

export default NumberMask;
