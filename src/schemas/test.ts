import { getErrorMessage } from "@/utils";
import { z } from "zod";

export const formSchema = z.object({
  test: z
    .string({ required_error: getErrorMessage("string.required") })
    .trim()
    .min(1, getErrorMessage("string.required")),
  password: z.string().optional(),
  area: z.string().optional(),
  search: z.string().optional(),
  comboboxSingle: z.string().optional(),
  combobox: z.array(z.string()).min(1).optional(),
  asyncComboboxSingle: z
    .object({
      value: z.string().transform((v) => (!isNaN(Number(v)) ? Number(v) : undefined)),
      label: z.string(),
    })
    .optional(),

  asyncCombobox: z
    .array(
      z.object({
        value: z.coerce.number().transform((v) => (!isNaN(Number(v)) ? Number(v) : undefined)),
        label: z.string(),
      }),
    )
    .min(1)
    .optional(),
  checkbox: z.boolean().optional(),
  checkboxGroup: z.array(z.string()).optional(),
  radio: z.string().optional(),
  date: z.date().optional(),
});
