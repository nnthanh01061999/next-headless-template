/* eslint-disable react/jsx-no-undef */
"use client";
import { useAuthActions } from "@/store/auth-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useEffect } from "react";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function ClientProvider({ children }: PropsWithChildren) {
  const { init } = useAuthActions();

  useEffect(() => {
    init();
  }, [init]);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export default ClientProvider;
