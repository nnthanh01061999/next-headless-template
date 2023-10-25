"use client";

import BadgeEllipsis from "@/components/ui/badge-ellipsis";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandEmptyProps,
  CommandGroup,
  CommandGroupProps,
  CommandItem,
  CommandItemProps,
  CommandProps,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollAreaProps } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { IOption } from "@/types";
import { PopoverContentProps, PopoverProps } from "@radix-ui/react-popover";
import { CommandLoading } from "cmdk";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import {
  CSSProperties,
  ChangeEvent,
  forwardRef,
  useMemo,
  useRef,
  useState,
} from "react";

type CustomProperties = {
  "--scroll-height": string;
};

type MainContentStyleProps = CSSProperties & CustomProperties;

export type TMode = "single" | "multiple";
export type TValueMode = "string" | "object";

export type ComboboxProps<M extends TMode, V extends TValueMode> = {
  mode: M;
  valueMode: V;
  value: M extends "single"
    ? V extends "string"
      ? string
      : IOption<string>
    : V extends "string"
    ? string[]
    : IOption<string>[];
  loading?: boolean;
  onChange: M extends "single"
    ? V extends "string"
      ? (value?: string) => void
      : (value?: IOption<string>) => void
    : V extends "string"
    ? (value?: string[]) => void
    : (value?: IOption<string>[]) => void;
  onBlur?: () => void;
  onSearch?: (value: string) => void;
  maxItemScroll?: number;
  options: IOption<string>[];
  popOverProps?: PopoverProps;
  popOverContentProps?: PopoverContentProps;
  triggerProps?: ButtonProps & {
    placeholder?: string;
  };
  commandProps?: CommandProps;
  commandEmptyProps?: CommandEmptyProps & {
    text?: string;
  };
  commandGroupProps?: CommandGroupProps;
  commandItemProps?: CommandItemProps;
  scrollProps?: ScrollAreaProps;
};

const Combobox = forwardRef<
  React.ElementRef<typeof Button>,
  | ComboboxProps<"single", "string">
  | ComboboxProps<"single", "object">
  | ComboboxProps<"multiple", "string">
  | ComboboxProps<"multiple", "object">
>((props, ref) => {
  const {
    options,
    loading = false,
    onSearch,
    onBlur,
    maxItemScroll = 10,
    popOverProps,
    popOverContentProps,
    triggerProps,
    commandProps,
    commandEmptyProps,
    commandGroupProps,
    commandItemProps,
    scrollProps,
  } = props;
  const {
    placeholder: triggerPlaceholder = "Select option",
    ..._triggerProps
  } = triggerProps || {};
  const { text: emptyText = "No option found.", ..._commandEmptyProps } =
    commandEmptyProps || {};

  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [optionHeight, setOptionHeight] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  const filterOptions = useMemo(() => {
    return search && !onSearch
      ? options.filter((option) => option.label?.toString().includes(search))
      : options;
  }, [onSearch, options, search]);

  const onSelect = (label: string) => (currentValue: string) => {
    const valueObj = {
      value: currentValue,
      label,
    };
    if (props.mode === "multiple") {
      if (props.valueMode === "string") {
        const value = props.value
          ? props.value.includes(currentValue)
            ? props.value.filter((item) => item !== currentValue)
            : [...props.value, currentValue]
          : [currentValue];
        props.onChange(value);
      } else {
        const value = props.value
          ? props.value.find((item) => item.value === currentValue)
            ? props.value.filter((item) => item.value !== currentValue)
            : [...props.value, valueObj]
          : [valueObj];
        props.onChange(value);
      }
    } else if (props.mode === "single") {
      if (props.valueMode === "string") {
        props.onChange(currentValue === props.value ? undefined : currentValue);
      } else {
        props.onChange(
          currentValue === props.value?.value ? undefined : valueObj
        );
      }
      setOpen(false);
    }
  };

  const onRemoveTag = (currentValue: string) => {
    if (props.mode === "multiple") {
      if (props.valueMode === "string") {
        if (props.value.includes(currentValue))
          props.onChange(props.value.filter((item) => item !== currentValue));
      } else {
        if (props.value.find((v) => v.value === currentValue))
          props.onChange(
            props.value.filter((item) => item.value !== currentValue)
          );
      }
    }
  };

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(e.target.value);
    onSearch?.(value);
  };

  const getMultipleBadgeOptions = () => {
    if (props.mode === "single") return [];
    if (props.valueMode === "object") return props.value;
    const valueMap: Record<string, number> = props.value.reduce(
      (prev, cur, index) => ({ ...prev, [cur]: index + 1 }),
      {}
    );
    return options
      .filter((item) => valueMap[item.value])
      .sort((a, b) => valueMap[a.value] - valueMap[b.value]);
  };

  return (
    <Popover {...popOverProps} open={open} onOpenChange={setOpen}>
      <PopoverTrigger ref={ref} asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          {..._triggerProps}
          ref={triggerRef}
          onBlur={onBlur}
        >
          {props.mode === "multiple" ? (
            props.value?.length ? (
              <BadgeEllipsis
                options={getMultipleBadgeOptions()}
                onChange={onRemoveTag}
              />
            ) : (
              triggerPlaceholder
            )
          ) : props.value ? (
            props.valueMode === "string" ? (
              options.find((option) => option.value == props.value)?.label
            ) : (
              options.find((option) => option.value == props.value.value)?.label
            )
          ) : (
            triggerPlaceholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          {/* <input ref={ref} /> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        {...popOverContentProps}
        ref={(_ref) => {
          if (_ref && triggerRef.current) {
            _ref.style.width = `${triggerRef.current.offsetWidth}px`;
          }
        }}
        className="p-0"
      >
        <Command {...commandProps}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className={cn(
                "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              )}
              value={search}
              onChange={onChangeSearch}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-autocomplete="list"
            />
          </div>
          {options.length === 0 ? (
            <div className="py-6 text-center text-sm" {..._commandEmptyProps}>
              {emptyText}
            </div>
          ) : !!onSearch ? null : (
            <CommandEmpty {..._commandEmptyProps}>{emptyText}</CommandEmpty>
          )}
          <CommandGroup {...commandGroupProps}>
            <ScrollArea
              {...scrollProps}
              style={
                {
                  "--scroll-height": `${optionHeight * maxItemScroll}px`,
                } as MainContentStyleProps
              }
              className={cn([
                "w-full",
                filterOptions.length > maxItemScroll
                  ? "h-[var(--scroll-height)]"
                  : "h-fit",
              ])}
              ref={() => {
                const option = document.querySelector(
                  'div.relative[cmdk-item][data-value="option_0"]'
                );
                setOptionHeight(option?.clientHeight || 32);
              }}
            >
              {filterOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={onSelect(option.label)}
                  {...commandItemProps}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      (
                        props.mode === "single"
                          ? props.valueMode === "string"
                            ? props.value === option.value
                            : props.value?.value === option.value
                          : props.valueMode === "string"
                          ? props.value?.includes(option.value)
                          : props.value?.find(
                              (v) => String(v.value) === option.value
                            )
                      )
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
              {loading && (
                <div className="py-4 text-center text-sm">
                  <CommandLoading>Loading...</CommandLoading>
                </div>
              )}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

Combobox.displayName = "Combobox";

export default Combobox as unknown as <
  T extends ComboboxProps<TMode, TValueMode> =
    | ComboboxProps<"single", "string">
    | ComboboxProps<"single", "object">
    | ComboboxProps<"multiple", "string">
    | ComboboxProps<"multiple", "object">
>(
  props: T
) => JSX.Element;
