"use client";

import { ReactNode, createContext, useMemo } from "react";

type HydrationProviderProps = {
  children: ReactNode;
  userAgent: string;
};

type HydrationContextType = {
  userAgent: string;
};

export const HydrationContext = createContext<HydrationContextType>({ userAgent: "" });

const HydrationProvider = (props: HydrationProviderProps) => {
  const { children, userAgent } = props;

  const value = useMemo(() => ({ userAgent }), [userAgent]);

  return <HydrationContext.Provider value={value}>{children}</HydrationContext.Provider>;
};

export default HydrationProvider;
