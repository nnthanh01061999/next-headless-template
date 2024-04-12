"use client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNotify } from "@/components/ui/use-notify";
import { AlertCircle, Info, XCircle } from "lucide-react";

export type NotifyType = "confirm" | "warning" | "info" | "error";

const icons: Record<NotifyType, JSX.Element> = {
  confirm: <AlertCircle fill="orange" color="white" />,
  error: <XCircle fill="red" color="white" />,
  warning: <AlertCircle fill="orange" color="white" />,
  info: <Info fill="#1677ff" color="white" />,
};

function Notify() {
  const { notifies } = useNotify();

  return notifies.map(({ id, title, description, cancel, ok, onOk, contentProps, titleProps, descriptionProps, headerProps, footerProps, okProps, cancelProps, type, ...props }, index) => (
    <AlertDialog key={index} {...props}>
      <AlertDialogContent {...contentProps}>
        <AlertDialogHeader {...headerProps}>
          <div className="grid gap-2 grid-flow-col justify-start items-center">
            {icons[type || "confirm"]}
            <AlertDialogTitle {...titleProps}>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription {...descriptionProps}>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter {...footerProps}>
          <AlertDialogCancel {...cancelProps}>{cancel || type === "confirm" ? "Cancel" : "OK"}</AlertDialogCancel>
          {type === "confirm" && (
            <AlertDialogAction {...okProps} onClick={onOk}>
              {ok || "OK"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ));
}

export default Notify;
