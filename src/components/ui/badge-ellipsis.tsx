"use client";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Assign, IOption } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

const EllipsisTag = "ellipsis-tag";

interface BadgeEllipsisProps extends React.HTMLAttributes<HTMLDivElement> {}

function BadgeEllipsis({
  className,
  options,
  onChange,
  badgeProps,
  ...props
}: Assign<
  BadgeEllipsisProps,
  {
    badgeProps?: BadgeProps;
    options: IOption<string>[];
    onChange: (value: string) => void;
  }
>) {
  const showRef = useRef<HTMLDivElement>(null);
  const hideRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<IOption<string>[]>([]);

  const onClose = (item: string) => onChange(item);

  const _updateHide = useCallback(() => {
    const content = hideRef.current;
    if (!content) return;
    const isOver = content.clientWidth < content.scrollWidth;
    if (!isOver) {
      setContent(options);
      return;
    }
    let total = 0;
    let result: number = 0;
    const children = content.querySelectorAll("div");
    children.forEach((item) => {
      if (total + item.clientWidth < content.clientWidth) {
        total += item.clientWidth + 8;
        result += 1;
      }
    });

    const showResult = options.slice(0, result - 1);
    const resultFormat = [
      ...showResult,
      {
        value: EllipsisTag,
        label: `+${options.length - showResult.length} ...`,
      },
    ];
    setContent(resultFormat);
  }, [options]);

  useEffect(() => {
    _updateHide();
    window.addEventListener("resize", _updateHide);
    return () => {
      window.removeEventListener("resize", _updateHide);
    };
  }, [_updateHide]);

  return (
    <>
      <div ref={showRef} className={cn("grid w-full grid-flow-col items-center justify-start gap-1 overflow-hidden", className)} {...props}>
        {content.map((item) => (
          <Badge key={item.value} variant="secondary" onClose={item.value === EllipsisTag ? undefined : onClose} value={item.value} {...badgeProps}>
            {item.label}
          </Badge>
        ))}
      </div>

      <div
        ref={hideRef}
        className={cn("absolute left-0 top-0 -z-10 grid w-full grid-flow-col items-center justify-start gap-1 overflow-hidden px-2 opacity-0", className)}
        {...props}
        style={{
          width: showRef.current?.clientWidth + "px",
        }}
      >
        {options.map((item) => (
          <Badge key={item.value} variant="secondary" onClose={onClose} value={item.value} {...badgeProps}>
            {item.label}
          </Badge>
        ))}
      </div>
    </>
  );
}

export default BadgeEllipsis;
