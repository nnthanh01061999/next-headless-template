import { useEffect, useState } from "react";
import { useForceUpdate } from "./use-force-update";

export function useTextSelection(): Selection | null {
  const forceUpdate = useForceUpdate();
  const [selection, setSelection] = useState<Selection | null>(null);

  const handleSelectionChange = () => {
    setSelection(document.getSelection());
    forceUpdate();
  };

  useEffect(() => {
    setSelection(document.getSelection());
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return selection;
}
