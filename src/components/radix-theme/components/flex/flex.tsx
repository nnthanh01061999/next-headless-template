import * as React from "react";
import { extractProps } from "../../helpers";
import { layoutPropDefs, marginPropDefs } from "../../props";

import { FlexOwnProps, flexPropDefs } from "@/components/radix-theme/components/flex/flex.props";
import { Slot } from "@radix-ui/react-slot";
import type { ComponentPropsWithout, RemovedProps } from "../../helpers";
import type { LayoutProps, MarginProps } from "../../props";
import { cn } from "@/lib/utils";

type FlexElement = React.ElementRef<"div">;
interface CommonFlexProps extends MarginProps, LayoutProps, FlexOwnProps {}
type FlexDivProps = { as?: "div" } & ComponentPropsWithout<"div", RemovedProps>;
type FlexSpanProps = { as: "span" } & ComponentPropsWithout<"span", RemovedProps>;
type FlexProps = CommonFlexProps & (FlexSpanProps | FlexDivProps);

const Flex = React.forwardRef<FlexElement, FlexProps>((props, forwardedRef) => {
  const { className, asChild, as: Tag = "div", ...flexProps } = extractProps(props, flexPropDefs, layoutPropDefs, marginPropDefs);
  const Comp = asChild ? Slot : Tag;
  return <Comp {...flexProps} ref={forwardedRef} className={cn(["flex justify-start", className])} />;
});
Flex.displayName = "Flex";

export { Flex };
export type { FlexProps };
