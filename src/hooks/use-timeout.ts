import { useCallback, useEffect, useRef } from "react";

export function useTimeout(callback: (...callbackParams: any[]) => void, delay: number, options: { autoInvoke: boolean } = { autoInvoke: false }) {
  const timeoutRef = useRef<number | null>(null);

  const start = useCallback(
    (...callbackParams: any[]) => {
      if (!timeoutRef.current) {
        timeoutRef.current = window.setTimeout(() => {
          callback(callbackParams);
          timeoutRef.current = null;
        }, delay);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [delay],
  );

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (options.autoInvoke) {
      start();
    }

    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clear, start]);

  return { start, clear };
}
