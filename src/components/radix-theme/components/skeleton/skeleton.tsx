import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { skeletonPropDefs } from "./skeleton.props";
import { extractProps } from "../../helpers";
import { marginPropDefs } from "../../props";
import "./skeleton.css";

import type { ComponentPropsWithout, RemovedProps } from "../../helpers";
import type { GetPropDefTypes, MarginProps } from "../../props";
import { cn } from "@/lib/utils";

type SkeletonElement = React.ElementRef<"span">;
type SkeletonOwnProps = GetPropDefTypes<typeof skeletonPropDefs>;
interface SkeletonProps extends ComponentPropsWithout<"span", RemovedProps>, MarginProps, SkeletonOwnProps {}
const Skeleton = React.forwardRef<SkeletonElement, SkeletonProps>((props, forwardedRef) => {
  const { children, className, loading, ...skeletonProps } = extractProps(props, skeletonPropDefs, marginPropDefs);

  if (!loading) return children;

  const Tag = React.isValidElement(children) ? Slot : "span";

  return (
    <Tag
      ref={forwardedRef}
      aria-hidden
      className={cn(["rt-Skeleton", className])}
      data-inline-skeleton={React.isValidElement(children) ? undefined : true}
      tabIndex={-1}
      // Workaround to use `inert` until https://github.com/facebook/react/pull/24730 is merged.
      {...{ inert: true ? "" : undefined }}
      {...skeletonProps}
    >
      {children}
    </Tag>
  );
});
Skeleton.displayName = "Skeleton";

export { Skeleton };
export type { SkeletonProps };
