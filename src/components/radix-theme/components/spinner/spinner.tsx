import * as React from "react";
import { Flex } from "../flex/flex";

import { extractProps } from "../../helpers";
import { marginPropDefs } from "../../props";

import { spinnerPropDefs } from "@/components/radix-theme/components/spinner/spinner.props";
import { Loader } from "lucide-react";
import type { ComponentPropsWithout, RemovedProps } from "../../helpers";
import type { GetPropDefTypes, MarginProps } from "../../props";
import { cn } from "@/lib/utils";

type SpinnerElement = React.ElementRef<"span">;
type SpinnerOwnProps = GetPropDefTypes<typeof spinnerPropDefs>;
interface SpinnerProps extends ComponentPropsWithout<"span", RemovedProps>, MarginProps, SpinnerOwnProps {}
const Spinner = React.forwardRef<SpinnerElement, SpinnerProps>((props, forwardedRef) => {
  const { className, children, loading, ...spinnerProps } = extractProps(props, spinnerPropDefs, marginPropDefs);

  if (!loading) return children;

  const spinner = (
    <span {...spinnerProps} ref={forwardedRef} className={cn([className])}>
      <Loader className="animate-spin" />
    </span>
  );

  if (children === undefined) return spinner;

  return (
    <Flex asChild position="relative" align="center" justify="center">
      <span>
        {/**
         * `display: contents` removes the content from the accessibility tree in some browsers,
         * so we force remove it with `aria-hidden`
         */}
        <span
          aria-hidden
          style={{ display: "contents", visibility: "hidden" }}
          // Workaround to use `inert` until https://github.com/facebook/react/pull/24730 is merged.
          {...{ inert: true }}
        >
          {children}
        </span>

        <Flex asChild align="center" justify="center" position="absolute" inset="0">
          <span>{spinner}</span>
        </Flex>
      </span>
    </Flex>
  );
});
Spinner.displayName = "Spinner";

export { Spinner };
export type { SpinnerProps };
