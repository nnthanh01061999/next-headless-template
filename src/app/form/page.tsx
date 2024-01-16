"use client";
import FormAsyncCombobox from "@/components/control/async-combobox/FormAsyncCombobox";
import FormCheckbox from "@/components/control/checkbox/FormCheckbox";
import FormCheckboxGroup from "@/components/control/checkbox/FormCheckboxGroup";
import FormCombobox from "@/components/control/combobox/FormCombobox";
import FormDatePicker from "@/components/control/date-picker/FormDatePicker";
import FormInput from "@/components/control/input/FormInput";
import FormInputPassword from "@/components/control/input/FormInputPassword";
import FormInputSearch from "@/components/control/input/FormInputSearch";
import FormTextArea from "@/components/control/input/FormTextArea";
import FormRadio from "@/components/control/radio/FormRadio";
import { Button } from "@/components/ui/button";
import { getBeURL } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import NumberMask from "@/components/ui/number-mask";
import PatternMask from "@/components/ui/pattern-mask";

export default function Home() {
  const [maskString, setMaskString] = useState<string>();
  const [maskNumber, setMaskNumber] = useState<number>();

  const forms = useForm({
    defaultValues: {
      checkbox: false,
      combobox: ["option_1", "option_2"],
      asyncCombobox: [
        {
          value: 16,
          label: "First Note 16",
        },
        {
          value: 17,
          label: "First Note 17",
        },
        {
          value: 18,
          label: "First Note 18",
        },
      ],
    },
    resolver: zodResolver(
      z.object({
        test: z
          .string({ required_error: "Required" })
          .trim()
          .min(1, "Required"),
        password: z.string().optional(),
        area: z.string().optional(),
        search: z.string().optional(),
        comboboxSingle: z.string().optional(),
        combobox: z.array(z.string()).min(1).optional(),
        asyncComboboxSingle: z
          .object({
            value: z
              .string()
              .transform((v) => (!isNaN(Number(v)) ? Number(v) : undefined)),
            label: z.string(),
          })
          .optional(),

        asyncCombobox: z
          .array(
            z.object({
              value: z.coerce
                .number()
                .transform((v) => (!isNaN(Number(v)) ? Number(v) : undefined)),
              label: z.string(),
            })
          )
          .min(1)
          .optional(),
        checkbox: z.boolean().optional(),
        checkboxGroup: z.array(z.string()).optional(),
        radio: z.string().optional(),
        date: z.date().optional(),
      })
    ),
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono space-y-2">
        <FormProvider {...forms}>
          <form
            onSubmit={forms.handleSubmit((e) => console.log(e))}
            className="grid gap-4"
          >
            <div className="grid gap-2 grid-cols-2">
              <FormInput
                name="test"
                label="test"
                description="This is description"
                required
              />
              <FormInputPassword
                name="password"
                label="password"
                description="This is description"
                required
              />
              <FormTextArea
                name="area"
                label="area"
                description="This is description"
                required
              />
              <FormInputSearch
                name="search"
                label="search"
                description="This is description"
                required
              />
              <FormCombobox
                name="comboboxSingle"
                label="combo single"
                description="This is description"
                required
                childProps={{
                  mode: "single",
                  valueMode: "string",
                  options: Array(20)
                    .fill(1)
                    .map((_, index) => ({
                      value: "option_" + index,
                      label: "option " + index,
                    })),
                }}
              />
              <FormCombobox
                name="combobox"
                label="combo"
                description="This is description"
                childProps={{
                  mode: "multiple",
                  valueMode: "string",
                  options: Array(20)
                    .fill(1)
                    .map((_, index) => ({
                      value: "option_" + index,
                      label: "option " + index,
                    })),
                }}
              />
              <FormAsyncCombobox
                name="asyncComboboxSingle"
                label="combo"
                description="This is description"
                childProps={{
                  mode: "single",
                  config: {
                    name: "note",
                    url: getBeURL("/note"),
                    valueField: "id",
                    labelField: "name",
                    responseKey: "data.items",
                    search: {
                      searchKey: "keyword",
                    },
                  },
                }}
              />
              <FormAsyncCombobox
                name="asyncCombobox"
                label="combo"
                description="This is description"
                childProps={{
                  mode: "multiple",
                  config: {
                    name: "note",
                    url: getBeURL("/note"),
                    valueField: "id",
                    labelField: "name",
                    responseKey: "data.items",
                    search: {
                      searchKey: "keyword",
                    },
                  },
                }}
              />
              <FormCheckbox
                name="checkbox"
                childProps={{ label: "this is checkbox" }}
              />
              <FormCheckboxGroup
                name="checkboxGroup"
                childProps={{ label: "this is checkbox" }}
                options={Array(5)
                  .fill(1)
                  .map((_, index) => ({
                    value: "option_" + index,
                    label: "option " + index,
                  }))}
              />
              <FormRadio
                name="radio"
                options={Array(5)
                  .fill(1)
                  .map((_, index) => ({
                    value: "option_" + index,
                    label: "option " + index,
                  }))}
              />
              <FormDatePicker name="date" />
              <PatternMask
                value={maskString}
                onChange={(e) => {
                  setMaskString(e);
                }}
                format="#### ### ###"
              />
              <Button type="button" onClick={() => setMaskString("123456789")}>
                Set value
              </Button>
              <NumberMask
                value={maskNumber}
                onChange={(value) => setMaskNumber(value)}
              />
              <Button type="button" onClick={() => setMaskNumber(123456789)}>
                Set value
              </Button>
            </div>
            <Button className="w-fit" type="submit">
              Submit
            </Button>
          </form>
        </FormProvider>
      </div>
    </main>
  );
}
