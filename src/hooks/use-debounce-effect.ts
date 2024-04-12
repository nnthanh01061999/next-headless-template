import { DependencyList, EffectCallback, useCallback, useEffect } from "react";

export const useDebouncedEffect = (effect: EffectCallback, delay: number, deps: DependencyList[]) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = useCallback(effect, deps);

  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, delay]);
};
