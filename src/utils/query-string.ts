import { IOption, TParam } from "@/types";
import { isBoolean } from "lodash";
import { ReadonlyURLSearchParams } from "next/navigation";
import qs, { StringifyOptions } from "query-string";
import { getBoolean, getNumber, isNumberic } from "./formatter";

export const qsParse = (searchParams: ReadonlyURLSearchParams) => {
  return qs.parse(searchParams.toString());
};

export const qsParseString = (
  param: TParam,
  defaultValue: string | undefined = undefined
): string | undefined => {
  return param && typeof param === "string" ? param : defaultValue;
};

export const qsParseNumber = (
  param: TParam,
  defaultValue: number | undefined = 0
): number => {
  return isNumberic(param) ? getNumber(param) : defaultValue;
};

export const qsParseBoolean = (
  param: TParam,
  defaultValue: boolean | undefined = true
): boolean => {
  return isBoolean(param) ? getBoolean(param) : defaultValue;
};

export const qsParseObject = (
  valueParam: TParam,
  labelParam: TParam,
  defaultValue: any = undefined,
  numberic = false
): IOption<number> | undefined => {
  if (numberic) {
    return valueParam && isNumberic(valueParam) && labelParam
      ? {
          value: getNumber(valueParam),
          label: labelParam,
        }
      : defaultValue;
  }
  return valueParam && labelParam
    ? {
        value: valueParam + "",
        label: labelParam,
      }
    : defaultValue;
};

export const qsStringify = (
  object: Record<string, any>,
  options?: StringifyOptions
): string => {
  return qs.stringify(object, {
    sort: false,
    arrayFormat: "comma",
    ...options,
  });
};
