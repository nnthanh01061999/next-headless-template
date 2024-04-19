"use client";
import { useRoutingActions } from "@/store/routing-store";
import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

const useMyRouter = () => {
  const router = useRouter();
  const { setLoading } = useRoutingActions();

  const push = (href: string, options?: NavigateOptions) => {
    setLoading(true);
    router.push(href, options);
  };

  return {
    push,
  };
};

export default useMyRouter;
