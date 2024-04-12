"use client";
import { useEffect } from "react";

export interface KBShortcutEvent {
  save?: () => void;
  new?: () => void;
  filter?: () => void;
}

export interface KBShortcutDisabled {
  save?: boolean;
  new?: boolean;
  filter?: boolean;
}

export const useEffectKeyboardShortcut = (events: KBShortcutEvent, disabled?: KBShortcutDisabled) => {
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      let charCode = String.fromCharCode(event.which).toLowerCase();
      if ((event.ctrlKey || event.metaKey) && charCode === "s") {
        if (events.save && disabled?.save) {
          event.preventDefault();
          events.save();
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.shiftKey && charCode === "a") {
        if (events.new && disabled?.new) {
          event.preventDefault();
          events.new();
        }
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && charCode === "f") {
        if (events.filter && disabled?.filter) {
          event.preventDefault();
          events.filter();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [events, disabled]);
};
