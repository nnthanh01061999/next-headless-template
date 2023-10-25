import { ReactNode } from "react";

export type TFormProps = {
  name: string;
  description?: string;
  label?: string | ReactNode;
  required?: boolean;
  styles?: {
    itemClass?: string;
    labelClass?: string;
    descriptionClass?: string;
    errorMessageClass?: string;
  };
};
