import { MessageKeys, NestedKeyOf } from "next-intl";

export const getErrorMessage = (key: NestedKeyOf<IntlMessages["Common"]["form"]["validate"] | string>, value?: Record<string, any>) => {
  return JSON.stringify({ key: `Common.form.validate.${key}`, value });
};

export const parseErrorMessage = (value: string): { key: MessageKeys<IntlMessages, any>; value?: Record<string, any> } => {
  return JSON.parse(value);
};
