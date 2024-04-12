import { z } from "zod";
import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";

export const handleFilterQueryString = (searchParams: ReadonlyURLSearchParams, data: Record<any, any>) => {
  const params = new URLSearchParams(searchParams.toString());
  Object.entries(data).forEach(([key, value]) => {
    value ? params.set(key, value) : params.delete(key);
  });
  return params.toString();
};

export function useQueryString() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filter = useCallback(
    (data: Record<any, any>, _pathname = "", scrollTop = true) => {
      router.replace((_pathname || pathname) + "?" + handleFilterQueryString(searchParams, data), {
        scroll: scrollTop,
      });
    },
    [pathname, router, searchParams],
  );

  const parse = useCallback(
    <R extends z.ZodRawShape, T extends z.ZodObject<R>>(schema: T): z.infer<T> => {
      return schema.parse(Object.fromEntries(searchParams));
    },
    [searchParams],
  );

  return { router, pathname, searchParams, filter, parse };
}
