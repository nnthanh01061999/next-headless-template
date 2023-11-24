// Inspired by react-hot-notify library
import * as React from "react";

import {
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogContentProps,
  AlertDialogDescriptionProps,
  AlertDialogProps,
  AlertDialogTitleProps,
} from "@radix-ui/react-alert-dialog";
import { NotifyType } from "@/components/ui/notify";

const NOTIFY_LIMIT = 1;

export type TNotify = AlertDialogProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  cancel?: React.ReactNode;
  ok?: React.ReactNode;
  type?: NotifyType;
  onOk?: () => void;
  contentProps?: AlertDialogContentProps;
  titleProps?: AlertDialogTitleProps;
  descriptionProps?: AlertDialogDescriptionProps;
  headerProps?: React.HTMLAttributes<HTMLDivElement>;
  footerProps?: React.HTMLAttributes<HTMLDivElement>;
  okProps?: Omit<AlertDialogActionProps, "onClick">;
  cancelProps?: AlertDialogCancelProps;
};

const actionTypes = {
  ADD_NOTIFY: "ADD_NOTIFY",
  UPDATE_NOTIFY: "UPDATE_NOTIFY",
  REMOVE_NOTIFY: "REMOVE_NOTIFY",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_NOTIFY"];
      notify: TNotify;
    }
  | {
      type: ActionType["UPDATE_NOTIFY"];
      notify: Partial<TNotify>;
    }
  | {
      type: ActionType["REMOVE_NOTIFY"];
      notifyId?: TNotify["id"];
    };

interface State {
  notifies: TNotify[];
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_NOTIFY":
      return {
        ...state,
        notifies: [action.notify, ...state.notifies].slice(0, NOTIFY_LIMIT),
      };

    case "UPDATE_NOTIFY":
      return {
        ...state,
        notifies: state.notifies.map((t) =>
          t.id === action.notify.id ? { ...t, ...action.notify } : t
        ),
      };

    case "REMOVE_NOTIFY":
      if (action.notifyId === undefined) {
        return {
          ...state,
          notifies: [],
        };
      }
      return {
        ...state,
        notifies: state.notifies.filter((t) => t.id !== action.notifyId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { notifies: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Notify = Omit<TNotify, "id">;

function notify({ ...props }: Notify) {
  const id = genId();

  const update = (props: TNotify) =>
    dispatch({
      type: "UPDATE_NOTIFY",
      notify: { ...props, id },
    });
  const remove = () => dispatch({ type: "REMOVE_NOTIFY", notifyId: id });

  dispatch({
    type: "ADD_NOTIFY",
    notify: {
      type: "confirm",
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) remove();
      },
    },
  });

  return {
    id: id,
    remove,
    update,
  };
}

function useNotify() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    notify,
    remove: (notifyId?: string) =>
      dispatch({ type: "REMOVE_NOTIFY", notifyId }),
  };
}

export { notify, useNotify };
