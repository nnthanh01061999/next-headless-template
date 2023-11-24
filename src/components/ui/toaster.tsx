"use client";

import {
  PositionVariant,
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { ToasterToast, useToast } from "@/components/ui/use-toast";
import { useMemo } from "react";

type ToastGroupPosition = {
  position: PositionVariant["position"];
  toasts: ToasterToast[];
};

const toastViewportPositionClasses = {
  "bottom-right": "sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col",
  "top-right": "sm:bottom-auto sm:right-0 sm:top-0 sm:flex-col-reverse",
  "top-middle":
    "sm:bottom-auto sm:right-1/2 sm:translate-x-1/2 sm:top-0 sm:flex-col-reverse",
  "bottom-left": "sm:bottom-0 sm:left-0 sm:top-auto sm:flex-col",
  "top-left": "sm:bottom-auto sm:left-0 sm:top-0 sm:flex-col-reverse",
} satisfies Record<NonNullable<PositionVariant["position"]>, string>;

export function Toaster() {
  const { toasts } = useToast();
  const toastsGroupPosition: ToastGroupPosition[] = [
    {
      position: "bottom-right",
      toasts: toasts.filter((toast) => toast.position === "bottom-right"),
    },
    {
      position: "top-right",
      toasts: toasts.filter((toast) => toast.position === "top-right"),
    },
    {
      position: "top-middle",
      toasts: toasts.filter((toast) => toast.position === "top-middle"),
    },
    {
      position: "bottom-left",
      toasts: toasts.filter((toast) => toast.position === "bottom-left"),
    },
    {
      position: "top-left",
      toasts: toasts.filter((toast) => toast.position === "top-left"),
    },
  ];

  return toastsGroupPosition.map((group) => {
    return (
      <ToastProvider key={group.position}>
        {group.toasts?.map(function ({
          id,
          title,
          description,
          action,
          ...props
        }) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          );
        })}
        <ToastViewport
          className={
            toastViewportPositionClasses[
              group.position as keyof typeof toastViewportPositionClasses
            ]
          }
        />
      </ToastProvider>
    );
  });
}
